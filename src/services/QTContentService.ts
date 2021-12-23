import { IQTContent, SearchQTContentDTO } from "@types";
import { QTContentModel } from "../models";

export const findAll = () => {
    return QTContentModel.find();
};

export const findOne = ({ contentType, date }: SearchQTContentDTO) => {
    return QTContentModel.findOne({ contentType, date });
}

export const createOne = (content: IQTContent) => {
    return new QTContentModel(content).save();
};

export const deleteOne = ({ contentType, date }: SearchQTContentDTO) => {
    return QTContentModel.deleteOne({ contentType, date });
};
