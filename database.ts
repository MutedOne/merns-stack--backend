// src/app.ts
import express from 'express';
import { login } from './logincontroller';
import {  topAch, projectStatus,projectView } from './dashboardcontroller';
import {viewId, download, getschedule, gettotalschedule,getDone,gettotaldone, getPrio,gettotalPrio, getDelay, gettotaldelay, getdashboard, toexcel, updateApprove,taskapprover, approvelevel} from './taskcontroller'
import {    getProjects,  gettotalProjects, allProjects, getProjid, getProjcust, getProjpp} from './projectController'
import { addAccount, getAccount,getDepartmentList,getRoleList,gettotalaccount } from './accountcontroller';
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', login);

app.get('/projectStatus', projectStatus);
app.get('/topAchiever', topAch);
app.post('/viewproj', projectView);

app.post('/delayrow', gettotaldelay);
app.post('/donerow', gettotaldone);
app.post('/priorityrow', gettotalPrio);
app.post('/scheduledrow', gettotalschedule);
app.post('/listdelay', getDelay);
app.post('/listscheduled', getschedule);
app.post('/listpriority', getPrio);
app.post('/listdone', getDone);

app.post('/accountrow',  gettotalaccount);
app.post('/listemp', getAccount);

app.post('/prorow',  gettotalProjects);
app.post('/listpro', getProjects);

app.get('/viewId',  viewId);
app.get('/taskapprover',  taskapprover);
app.get('/approvelevel',  approvelevel);
app.patch('/approve',  updateApprove);

app.get('/departmentlist',  getDepartmentList);
app.post('/rolelist',  getRoleList);
app.post('/addaccount',  addAccount);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
