var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ProjectSchema = new Schema({
    owner: String,
    title: String,
	owner_email: String,
	owner_rank: String,
	owner_name: String,
    description: String,
    disciplines: [String],
    firstSemester: Number,
    maxStudents: Number,
    goals: String,
    keyElements: String,
    researchIssues: String,
    meetingTime: Date,
    advisors: [{name: String, school: String}],
    sponsors: [{name: String, detail: String}],
    majPrepInt: [String],
    faculty: [{name: String, email: String}],
    mentor: [{name: String, email: String}],
	addedStudents: [{name: String, email: String}], //Students added to project by pi
    members: [String],
	members_detailed: [String],
    contact: [{name: String, phone: String, email: String, office: String}],
    status: String,
	edited: Boolean,
	old_project: [Schema.Types.Mixed],
    image: String,
    //video_url: String,
    video_url: [{vidurl: String, vimgurl: String}],
    attachments: [{name: String, url: String}],
    deliverables_attached: [{name: String, url: String}],
	mingle_url: String,
    youtube_url: String,
    github_url: String,
    drive_url: String,
	archive_url: String,
    term: { type: String, default: 1 },
	 // User Story #1144
    reqskillItem: {type: String},
	//Joe UserStory
	semester: String,
		//Userstory 1207
   proposedDate: {type: String}
});

module.exports = mongoose.model('Projects', ProjectSchema);
