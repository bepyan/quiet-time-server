import { SubscriptNotionDTO, UserDTO } from "@types";
import { UserModel } from "../models";

export const findAll = () => {
  return UserModel.find();
};

export const findUser = ({ name }: { name: string }) => {
  return UserModel.findOne({ name });
};

export const createUser = (user: UserDTO) => {
  return new UserModel(user).save();
};

export const deleteUser = (name: string) => {
  return UserModel.deleteOne({ name });
};

export const addNotion = ({ name, notion }: SubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $push: { notions: notion } });
};

export const delelteNotion = ({ name, notion }: SubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $pull: { notions: notion } });
};

export const hasSubscript = async ({ name, notion }: SubscriptNotionDTO) => {
  const duplicated = await UserModel.findOne({
    name,
    notions: { $elemMatch: notion },
  });
  return !!duplicated;
};
