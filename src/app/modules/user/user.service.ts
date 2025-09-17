import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import mongoose from 'mongoose';
import { Task } from '../task/task.model';
import { Category } from '../category/category.model';

const createUserToDB = async (payload: Partial<IUser>): Promise<any> => {
  //set role
  payload.role = USER_ROLES.USER;
  let createUser;

  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    
    //send email
    const otp = generateOTP(6);
    const values = {
      name: isUserExist.name,
      otp: otp,
      email: isUserExist.email!,
    };
    
    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    //save to DB
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 5 * 60000),
      isResetPassword: false,
    };

    isUserExist.password = payload.password!;
    isUserExist.authentication = authentication;
    await isUserExist.save();

    return {
      message: "Otp send successfully on your email!",
      statusCode: 409,
      user:{
        name: isUserExist.name,
        email: isUserExist.email,
        image: isUserExist.image,
        isVerified: isUserExist.verified,
      }
    };

  } else {
    createUser = await User.create(payload);
    if (!createUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
  }

  //send email
  const otp = generateOTP(6);
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 5 * 60000),
    isResetPassword: false,
  };

  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return {
    name: createUser.name,
    email: createUser.email,
    image: createUser.image,
  };
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isValidUser(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  };

  delete isExistUser.strike;
  delete isExistUser.fmToken;

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.findById(id).lean().exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    if (isExistUser.image) {
      unlinkFile(isExistUser.image);
    }
  }

  const updateDoc = await User
    .findOneAndUpdate(
      { _id: id }, 
        payload, 
      { new: true, }
    )
    .select("-authentication -role -createdAt -updatedAt -verified -status")
    .lean();

  return updateDoc;
};

const deleteProfileToDB = async (
  user: JwtPayload,
  payload: any
) => {
  const { password } = payload;
  const { id } = user;
  const isExistUser = await User.findById(new mongoose.Types.ObjectId(id)).select("+password").lean().exec();
  
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  //unlink file here
  if (payload.image) {
    if (isExistUser.image) {
      unlinkFile(isExistUser.image);
    }
  }

  await User.deleteOne({ _id: isExistUser._id })

  return "DONE"
};

const todaysSumery = async (payload: JwtPayload) => {
  const objId = new mongoose.Types.ObjectId(payload.id);

  const user = await User.findById(objId).lean();
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // Today's start and end
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Get all tasks created today
  const tasks = await Task.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  }).lean();

  // Count strict tasks for today
  const strictTasksCount = await Task.countDocuments({
    isInStrick: true,
    selectDate: { $gte: startOfDay, $lte: endOfDay },
  });

  // Get all unique category IDs from today's tasks
  const categoryIds = tasks
    .map((task) => task.category)
    .filter((id) => id != null);

  // Sum coins from categories
  let totalCoins = 0;
  if (categoryIds.length > 0) {
    const categories = await Category.find({
      _id: { $in: categoryIds },
    }).lean();

    totalCoins = categories.reduce((sum, cat) => sum + (cat.coin || 0), 0);
  }

  return {
    taskLogged: tasks.length,
    coinSpent: totalCoins,
    activeStrike: strictTasksCount,
  };
};

export const UserService = {
  createUserToDB,
  todaysSumery,
  deleteProfileToDB,
  getUserProfileFromDB,
  updateProfileToDB,
};