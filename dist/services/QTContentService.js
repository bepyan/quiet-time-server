"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToAllUser = exports.publishToOneUser = exports.publishContent = exports.collectContent = exports.deleteOne = exports.createOne = exports.findOne = exports.findAll = void 0;
const _1 = require(".");
const models_1 = require("../models");
const utils_1 = require("../utils");
const findAll = () => {
    return models_1.QTContentModel.find();
};
exports.findAll = findAll;
const findOne = ({ contentType, date = utils_1.Time.toYMD(), }) => __awaiter(void 0, void 0, void 0, function* () {
    let content = yield models_1.QTContentModel.findOne({
        contentType,
        date,
    });
    if (!content)
        content = yield _1.CrawlerService.parse(contentType);
    return content;
});
exports.findOne = findOne;
const createOne = (content) => {
    return new models_1.QTContentModel(content).save();
};
exports.createOne = createOne;
const deleteOne = ({ contentType, date }) => {
    return models_1.QTContentModel.deleteOne({ contentType, date });
};
exports.deleteOne = deleteOne;
const collectContent = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(_1.CrawlerService.crawlerKeyList.map((key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const content = yield _1.CrawlerService.parse(key);
            yield (0, exports.createOne)(content);
        }
        catch (e) {
            console.error(e);
        }
    })));
});
exports.collectContent = collectContent;
const publishContent = ({ notion_auth, notion: { database_id, contentType }, }) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield (0, exports.findOne)({ contentType });
    return _1.NotionService.createQTPage({
        notion_auth,
        database_id,
        content,
    });
});
exports.publishContent = publishContent;
const publishToOneUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, notion_auth, notions } = user;
    let jobs_done = 0;
    for (const notion of notions) {
        try {
            yield (0, exports.publishContent)({ notion_auth, notion });
            jobs_done++;
        }
        catch (e) {
            console.log(`$$ delete error notion | ${name} ${notion.database_id} `);
            yield _1.UserService.deleteNotion({ name, notion });
        }
    }
    return jobs_done;
});
exports.publishToOneUser = publishToOneUser;
const publishToAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("$$ start publishing QT");
    const users = yield _1.UserService.findAll();
    const jobs = users.reduce((ac, v) => ac + v.notions.length, 0);
    console.log(`$$ discover ${jobs} jobs`);
    let jobs_done = 0;
    for (const user of users) {
        jobs_done += yield (0, exports.publishToOneUser)(user);
    }
    console.log(`$$ ${jobs_done} content published ✨`);
});
exports.publishToAllUser = publishToAllUser;
//# sourceMappingURL=QTContentService.js.map