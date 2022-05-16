const db = require("../database");

// GET /app - All apps
const getAllApps = (req, res) => {
    db.query("SELECT * FROM application", (err, result) => {
        res.json(result);
    });
};

// GET /app/:appAcronym - Get app by acronym
const getAppByAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM application WHERE app_acronym = ?", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: "No app found!" });
            };
        };
    });
};

// POST /app/create - Create new app project
const addNewApp = (req, res) => {
    const { appAcronym, appDesc, appRnumber, startDate, endDate, permitCreate, permitOpen, permitToDoList, permitDoing, permitDone } = req.body;
    db.query("SELECT * FROM application WHERE app_acronym = ?", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json({ message: "App acronym already taken!" });
            } else {
                db.query("INSERT INTO application (app_acronym, app_description, app_Rnumber, app_startDate, app_endDate, app_permit_create, app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done) VALUES (?,?,?,?,?,?,?,?,?,?)", [appAcronym, appDesc, appRnumber, startDate, endDate, permitCreate, permitOpen, permitToDoList, permitDoing, permitDone], (err, result) => {
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

// PUT /app/:appAcronym/update - update app
const updateApp = (req, res) => {
    const { appDesc, startDate, endDate, permitCreate, permitOpen, permitToDoList, permitDoing, permitDone } = req.body;
    const { appAcronym } = req.params;
    db.query("UPDATE application SET app_description = ?, app_startDate = ?, app_endDate = ?, app_permit_create = ?, app_permit_open = ?, app_permit_toDoList = ?, app_permit_doing = ?, app_permit_done = ? WHERE app_acronym = ?", [appDesc, startDate, endDate, permitCreate, permitOpen, permitToDoList, permitDoing, permitDone, appAcronym], (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result) {
                res.json({ message: "App updated!" });
            } else {
                res.json({ message: "Failed to update app!"});
            };
        };
    });
};

module.exports = {
    getAllApps,
    addNewApp,
    getAppByAcronym,
    updateApp
};