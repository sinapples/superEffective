// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,
 
    intentMap: {
       'AMAZON.StopIntent': 'END',
       'AMAZON.FallbackIntent': 'Goodbye',
       'Default Fallback Intent': 'help',
       'AMAZON.FallbackIntent': 'help',
       'AMAZON.NavigateHomeIntent': 'Welcome',
    },
 
    db: {
         FileDb: {
             pathToFile: '../db/db.json',
         }
     },
 };
 