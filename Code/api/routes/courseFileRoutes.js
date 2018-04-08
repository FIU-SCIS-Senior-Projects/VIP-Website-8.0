const fs = require('fs');
var Course = require('../models/courses');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function (app, express) {
    var apiRouter = express.Router();

    apiRouter.route('/courseFiles')
        .get( // get lists of course files
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                var directory = __dirname + '/../../../../';
                fs.readdir(directory, (err, files) => {
                    var response = [];
                    files.forEach(file => {                      
                      if (file.match('.*-.*-.*\.txt') || file.match('.*-.*-.*-INC\.txt')){
                        var contents = fs.readFileSync(directory + file, 'utf8');
                        response.push({
                            fileName: file,
                            content: contents
                        });
                      }                     
                    });
                    return res.json(response);
                  })
            })
            return apiRouter;
        }