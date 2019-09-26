const convert = require('xmljson');

export class XmlJson {

    /**
     * method to convert json to xml
     * @param {*} jsonObj
     * @returns
     * @memberof XmlJson
     */
    public JsonToXml(jsonObj: any) {
        // convert the json data to xml
        let jsonToXml: any;

        convert.to_xml(JSON.stringify(jsonObj), function (error, t) {
            jsonToXml = t;
        });

        return jsonToXml;
    }
}
