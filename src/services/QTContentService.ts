import { IQTContent, SearchQTContentDTO } from "@types";
import { QTContentModel } from "../models";

export const findAll = () => {
    return QTContentModel.find();
};

export const findOne = ({ date, type }: SearchQTContentDTO) => {
    return QTContentModel.findOne({ type, date });
}

export const createOne = (content: IQTContent) => {
    return new QTContentModel(content).save();
};

export const deleteOne = ({ date, type }: SearchQTContentDTO) => {
    return QTContentModel.deleteOne({ date, type });
};
