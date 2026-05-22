var DB_ID = ''; // TODO: inserire l'ID del foglio KS-DB

function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'index';
  var template = HtmlService.createTemplateFromFile('frontend/' + page);
  template.dbId = DB_ID;
  return template.evaluate()
    .setTitle('KSales')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
