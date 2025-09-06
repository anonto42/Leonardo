import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { TGetAllUsers } from './admin.type';
import { STATUS, USER_ROLES } from '../../../enums/user';
import { Condition } from '../conditionAndPolicys/conditionsAndpolicy.modle';

const allUsers = async (
  { page = 1, limit = 10 }: TGetAllUsers
) => {
  page = Math.max(Number(page), 1);
  limit = Math.max(Number(limit), 1);

  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments();

  const users = await User.find({ 
    role: {
      $ne: USER_ROLES.ADMIN
    }
  })
    .select('name email image createdAt coin completedTasks')
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    meta: {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      pageSize: limit,
      hasNextPage: page * limit < totalUsers,
      hasPrevPage: page > 1,
    },
    users,
  };
}

const getUserById = async (
  id: string
) => {
  const user = await User
    .findById(id)
    .select('name email image status gender age occupation nationality personality coin')
    .lean();
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
}

const setUserStatus = async (
  id: string, 
  status: STATUS
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.role === USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot change status of an admin user");
  }

  if (user.status === status) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `User is already ${status}`);
  }

  user.status = status;
  await user.save();

  return user;
}

const deleteUser = async (
  id: string
) => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.role === USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot delete an admin user");
  }

  await User.findByIdAndDelete(id);

  return {
    user:{
      name: user.name,
      email: user.email,
      coin: user.coin,
      completedTasks: user.completedTasks
    }
  };
}

const conditionCreate = async ( 
  payload: string
) => {

  const condition = await Condition.findOneAndUpdate({type: "TERMS" }, { content: payload}, { new: true }).lean();

  if (!condition) {
    await Condition.create({type: "TERMS",content:payload});
  }

  return "DONE"
}

const policyCreate = async ( 
  payload: string
) => {

  const condition = await Condition.findOneAndUpdate({type: "POLICY" }, { content: payload}, { new: true }).lean();

  if (!condition) {
    await Condition.create({type: "POLICY",content:payload});
  }

  return "DONE"
}

const getCondition = async () => await Condition.findOne({type: "TERMS"}).select("content -_id").lean().exec();
const getPolicy = async () => await Condition.findOne({type: "POLICY"}).select("content -_id").lean().exec();
 
export const AdminService = {
  allUsers, getPolicy,
  getUserById, policyCreate,
  updateUserStatus: setUserStatus,
  deleteUser, getCondition, conditionCreate,
};
