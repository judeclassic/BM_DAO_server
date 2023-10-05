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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:timers/promises");
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const yaml_1 = __importDefault(require("yaml"));
const YAML_SOURCE_URL = `${__dirname}/yaml_doc/openapi.yml`;
class DocumentationRepository {
}
_a = DocumentationRepository;
DocumentationRepository.writeDocumentation = (router) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, promises_1.setTimeout)(1000);
    const yamlToJson = yamljs_1.default.load(YAML_SOURCE_URL);
    router.listEndPoint.forEach((data) => {
        if (!yamlToJson.paths[data.endpoint]) {
            let title = data.method.toLowerCase().split('/')[1];
            yamlToJson.paths[data.endpoint] = {};
            yamlToJson.paths[data.endpoint][data.method.toLowerCase()] = {
                responses: {
                    '200': { description: 'OK' }
                }
            };
            yamlToJson.tags.push({
                name: title,
                description: `Secured ${title}-only calls`
            });
        }
    });
    const jsonToYaml = new yaml_1.default.Document();
    jsonToYaml.contents = yamlToJson;
    fs_1.default.writeFileSync(YAML_SOURCE_URL, jsonToYaml.toString());
    return yamlToJson;
});
DocumentationRepository.useSwaggerDocument = ({ app, router, documentationRoute, }) => __awaiter(void 0, void 0, void 0, function* () {
    const swaggerDocument = yield _a.writeDocumentation(router);
    app.use(documentationRoute, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
});
exports.default = DocumentationRepository;
