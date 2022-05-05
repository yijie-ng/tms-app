const db = require("../database");

// GET /apps - All apps
const getAllApps = (req, res) => {
    db.query("SELECT * FROM application", (err, result) => {
        res.json(result);
    });
};

// POST - Create new app project
const addNewApp = (req, res) => {
    const { appAcronym, appDesc, startDate, endDate, permitCreate, permitOpen, permitToDoList, permitDoing, permitDone } = req.body;
    db.query("SELECT * FROM application WHERE app_acronym = ?", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json({ message: "App acronym already taken!" });
            } else {
                db.query("INSERT INTO application (app_acronym, app_description, app_startDate, app_endDate, app_permit_create, app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done) VALUES (?,?,?,?,?,?,?,?,?)", [appAcronym, appDesc, startDate, endDate, permitCreate, permitOpen, permitToDoList, permitDoing, permitDone], (err, result) => {
                    if (err) {
                        res.json({ err: err });
                    } else {
                        if (result) {
                            res.json({ message: "New application project created!" });
                        } else {
                            res.json({ message: "Failed to create new application project!" });
                        };
                    };
                });
            };
        };
    });
};

module.exports = {
    getAllApps,
    addNewApp
};