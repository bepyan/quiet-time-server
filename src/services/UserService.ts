import { SubscriptNotionDTO, UserDTO } from '@types';
import { generateError } from '../middlewares';
import { UserModel } from '../models';

export const findAll = () => {
  return UserModel.find();
};

export const findUser = ({ name }: { name: string }) => {
  return UserModel.findOne({ name });
};

export const createUser = async (user: UserDTO) => {
  const res = await findUser({ name: user.name });
  if (!!res) return generateError({ status: 409, message: '중복된 아이디가 있어요.' });
  return new UserModel(user).save();
};

export const deleteUser = (name: string) => {
  return UserModel.deleteOne({ name });
};

export const addNotion = ({ name, notion }: SubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $push: { notions: notion } });
};

export const deleteNotion = ({ name, notion }: SubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $pull: { notions: notion } });
};

export const hasSubscript = async ({ name, notion }: SubscriptNotionDTO) => {
  const duplicated = await UserModel.findOne({
    name,
    notions: { $elemMatch: notion },
  });
  return !!duplicated;
};
