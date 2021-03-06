(function () {
    angular
        .module('projectApplicationController', ['ProjectProposalService', 'user-profile', 'toDoModule', 'userService',
            'reviewProfile', 'vip-projects'])
        .controller('projAppCtrl', function (ProjectService, ProfileService, ToDoService, User, reviewProfileService, reviewStudentAppService,
                                             adminService, LocationService, DateTimeService, SkillsService, $stateParams,
                                             $location, $window, $scope, $state, $document) {

            var vm = this;
            var profile;
            var currprof;
            $scope.done = false;
            $scope.joinAs = "fac";

            vm.adminEmail;
            adminService.getAdminSettings().then(function (data)
            {
                adminData = data;
                vm.adminEmail = adminData.current_email;
            });

            $scope.applyFilter = function(input) {
                return input.status.openForApply == true;
              };


            ProfileService.loadProfile().then(function (data) {
                if (data) {
                    vm.Colleges = [
                        {
                            name: 'Architecture + The Arts ',
                            schools: [
                                'Architecture',
                                'Interior Architecture',
                                'Landscape Architecture and Environmental Urban Design',
                                'Art and Art History',
                                'Communication Arts',
                                'School of Music',
                                'Theatre']
                        },
                        {
                            name: 'Arts and Sciences & Education',
                            schools: [
                                'Biological Sciences',
                                'Chemistry and Biochemistry',
                                'Earth and Environment',
                                'English',
                                'Mathematics and Statistics',
                                'Philosophy',
                                'Physics',
                                'Psychology',
                                'Teaching and Learning',
                                'Leadership and Professional Studies',
                                'School of Education',
                                'School of Enviroment, Arts & Society',
                                'School of Integrated Science & Humanity'

                            ]
                        },
                        {
                            name: 'Business',
                            schools: [
                                'Decision Sciences and Information Systems',
                                'Alvah H. Chapman Jr. Graduate School of Business',
                                'R. Kirk Landon Undergraduate School of Business',
                                'Finance',
                                'Management and International Business',
                                'Marketing',
                                'School of Accounting',
                                'Real Estate'
                            ]
                        },
                        {
                            name: 'Chaplin School of Hospitality and Tourism Management',
                            schools: [
                                'Hospitality and Tourism Management'
                            ]
                        },
                        {
                            name: 'Engineering & Computing',
                            schools: [
                                'School of Computing and Information Sciences',
                                'OHL School of Construction',
                                'Department of Biomedical Engineering',
                                'Department of Civil and Environment Engineering',
                                'Department of Electrical and Computer Engineering',
                                'Department of Mechanical and Materials Engineering'
                            ]
                        },
                        {
                            name: 'Herbert Wertheim College of Medicine',
                            schools: [
                                'Cellular Biology and Pharmacology',
                                'Human and Molecular Genetics',
                                'Immunology',
                                'Medical and Population Health Sciences Research'
                            ]
                        },
                        // User Story #1175
                        {
                            name: 'Honors College',
                            schools: []
                        },
                        {
                            name: 'Journalism and Mass Communication',
                            schools: [
                                'Advertising and Public Relations',
                                'Journalism Broadcasting and Digital Media'
                            ]
                        },
                        {
                            name: 'Law',
                            schools: [
                                'College of Law'
                            ]
                        },
                        {
                            name: 'Nicole Wertheim College of Nursing & Health Sciences',
                            schools: [
                                'Biostatistics',
                                'Dietetics and Nutrition',
                                'Environmental and Occupational Health',
                                'Epidemiology',
                                'Health Policy and Management',
                                'Health Promotion and Disease Prevention'
                            ]

                        },
                        {
                            name: 'Robert Stempel College of Public Health & Social Work',
                            schools: [
                                'School of Social Work'
                            ]
                        },
                        {
                            name: 'Steven J. Green School of International and Public Affairs',
                            schools: [
                                'Criminal Justice',
                                'Economics',
                                'Global and Sociocultural Studies',
                                'History',
                                'Modern Languages',
                                'Public Administration',
                                'Religious Studies'
                            ]
                        }
                    ];
                    //Sprint#5 part 3
                    vm.ranks = [
                        {"name": "Freshman", "rank": "Student"},
                        {"name": "Sophmore", "rank": "Student"},
                        {"name": "Junior", "rank": "Student"},
                        {"name": "Senior", "rank": "Student"},
                        {"name": "Masters", "rank": "Student"},
                        {"name": "PhD", "rank": "Student"},
                        {"name": "postDoc", "rank": "Student"},
                        {"name": "PI", "rank": "Pi/CoPi"},
                        {"name": "CoPI", "rank": "Pi/CoPi"},
                        {"name": "Coordinator", "rank": "Pi/CoPi"},
                        {"name": "External Member", "rank": "Pi/CoPi"},
                        {"name": "Administrator", "rank": "Staff/Faculty"},
                        {"name": "Director", "rank": "Staff/Faculty"},
                        {"name": "Instructor", "rank": "Staff/Faculty"},
                        {"name": "Assitant Professor", "rank": "Staff/Faculty"},
                        {"name": "Associate Professor", "rank": "Staff/Faculty"},
                        {"name": "Full Professor", "rank": "Staff/Faculty"}
                    ];
                    vm.genders = ['Male', 'Female'];
                    vm.semesters = ['Spring 2017', 'Summer 2017', 'Fall 2017'];

                    vm.selectedCollege = vm.Colleges.find(function (element) {
                        return element.name === data.college;
                    });
                    vm.selectedRank = vm.ranks.find(function (element) {
                        return element.name === data.rank;
                    });


                    $scope.done = true;
                    profile = data;

                    vm.user_info = data.firstName;
                    vm.user_type = data.userType;
                    vm.firstName = data.firstName;
                    vm.type = data.userType;
                    vm.lastName = data.lastName;
                    vm.gender = data.gender;
                    vm.email = data.email;
                    vm.pID = data.pantherID;
                    vm.selectedRank = data.rank;
                    vm.school = data.department;
                    vm.college = data.college;
                    vm.semester = data.semester;
                    vm.google = data.google;
                    vm.profile = data;
                    vm.branch = null;
                    vm.skillItem = data.skillItem;
                }
                else {
                    $scope.done = true;
                    //$window.sessionStorage.setItem('lr', 'studentConfirmation/');
                    //$location.path('login');
                    vm.semesters = ['Spring 2017', 'Summer 2017', 'Fall 2017'];
                    $scope.guest = true;
                }
            });


            init();
            function init() {
                loadData();
                loadTerms();
            }

            function loadData() {
                ProjectService.getProjects().then(function (data) {
                    vm.projects = data;
                    if ($stateParams.id) {
                        //alert("found some ID");
                        //alert(vm.id);
                        vm.id = $stateParams.id;
                        getProjectById(vm.projects);
                    } else {
                        vm.sProject = null;
                        //alert($stateParams.id);
                        //alert(vm.id);
                    }
                });
            }

            function getProjectById(projects) {
                ProjectService.getProject(vm.id).then(function (data) {

                    projects.forEach(function (project) {
                        if (data._id === project._id) {
                            vm.sProject = project;
                        }
                    });
                });
            }

            function loadTerms() {
                reviewStudentAppService.loadTerms().then(function (data) {
                    console.log("in loadTerms()");
                    $scope.terms = data;
                    vm.terms = data;
                    console.log(vm.terms);
                });
            }

            // returns 0 if student didnt fill out some part of the form
            //function validateStudentFormData(FormData, ProfileData)
            function validateStudentFormData(FormData) {
                console.log("FormData.sProject = " + FormData.sProject + ", " + "FormData.semester = " + FormData.semester + ", " + "FormData.user_type = " + FormData.user_type + ", " + "FormData.pID = " + FormData.pID + ", " + "FormData.selectedCollege = " + FormData.selectedCollege + ", " + "FormData.school = " + FormData.school);
                // make sure student has: selected a project, chosen a semester, pantherID, college, school/department
                if ((FormData.sProject != null) && (FormData.semester != null) && (FormData.user_type != null) && (FormData.pID != null) && (FormData.selectedCollege != null) && (FormData.school != null) && (FormData.skillItem != null)) {
                    return 1;
                }
                return 0;
            }

            function processStudentApplication(vm, profile) {
                // if the student has not filled out all of the required fields in the form, let them know, and return
                if (!validateStudentFormData(vm)) {
                    return 0;
                }

                return 1;
            }


            // note: vm.xxx = data from form, vm.profile.xxx = data from current users account
            vm.save = function () {
                SkillsService.saveSkills($scope.projApp.skillItem.split(',')
                    .map(function(skill) { return skill.trim(); })
                    .filter(function(skill) { return skill !== "" }));

                if (vm.sProject.status == 'Disabled') {
                    console.log(vm.sProject.status);
                    swal({
                        title: "Dear Student!",
                        text: "This project is inactive and not accepting any new applications. Please apply to an active project.",
                        type: "info",
                        confirmButtonText: "Okay",
                        showCancelButton: true,
                    }, function () {
                        //alert(1);
                        $window.location.href = "/#/vip-projects";
                    });
                    return;
                } else {
                    // in the event of high volume traffic, this function may take longer to complete for each user
                    loading();
                    //Userstory 1208
                    vm.appliedDate = DateTimeService.getCurrentDateTimeAsString();
                    vm.profile.appliedDate = vm.appliedDate;

                    if (vm.profile.userType == 'Student') {
                        for (i = 0; i < vm.projects.length; i++) {
                            project = vm.projects[i];
                            //console.log(project.title);
                            for (j = 0; j < project.members.length; j++) {
                                if (project.members[j].toLowerCase().trim() === profile.email.toLowerCase().trim()) {
                                    swal({
                                        title: "Dear Student!",
                                        text: "You have already applied to or joined the project '" + project.title + "'. Please leave that project before applying to any others",
                                        type: "info",
                                        confirmButtonText: "Okay",
                                        showCancelButton: true,
                                    }, function () {
                                        //alert(1);
                                        $window.location.href = "/#/vip-projects";
                                    });
                                    return;
                                }
                            }
                            //console.log(i);
                        }
                    }
                    // processes project application, if the user is not a guest
                    if (!$scope.guest) {
                        // if the user is a student
                        if (vm.profile.userType == "Student") {
                            // the student didnt supply all of the form data
                            if (!processStudentApplication(vm, vm.profile)) {
                                // let them know and dont go any furthere
                                studentMissingFields();
                                return;
                            }

                            console.log("vm.rank = " + vm.rank + ", vm.profile.rank = " + vm.profile.rank);
                            console.log("vm.pID = " + vm.pID + ", vm.profile.pantherID = " + vm.profile.pantherID);
                            console.log("vm.selectedCollege = " + vm.selectedCollege + ", vm.profile.college = " + vm.profile.college);
                        }

                        // note:
                        // vm = FormData (data provided in submitted form)
                        // vm.profile = ProfileData (data from db)
                        // if the user provided us with new information that wasnt previously in the database for their account, add that info to the db
                        //updateUserData(vm, vm.profile);

                        if (vm.profile.rank != vm.selectedRank) {
                            console.log("1");
                            vm.profile.rank = vm.selectedRank.name;
                        }

                        if (vm.profile.pantherID != vm.pID) {
                            console.log("2");
                            vm.profile.pantherID = vm.pID;
                        }

                        if (vm.profile.college != vm.selectedCollege) {
                            console.log("3");
                            vm.profile.college = vm.selectedCollege.name;
                        }

                        if (vm.profile.department != vm.school) {
                            console.log("4");
                            vm.profile.department = vm.school;
                        }

                        if (vm.profile.gender != vm.gender) {
                            console.log("5");
                            vm.profile.gender = vm.gender;
                        }
                        // User Story #1144
                        if (vm.profile.skillItem != vm.skillItem) {
                            console.log("6");
                            vm.profile.skillItem = vm.skillItem;
                        }

                        vm.profile.rank = vm.selectedRank;
                        vm.profile.vipcredit = vm.vipcredit;
                        vm.profile.independentstudy = vm.independentstudy;
                        if (vm.branch == '2') {
                            vm.profile.volunteer = "true";
                        }
                        // Adding semester to database
                        vm.profile.semester = vm.semester;
                        // User Story #1175
                        var collegename = vm.selectedCollege.name;
                        if (vm.school == "None" || vm.school == undefined) {
                            if (collegename != "Honors College") {
                                EnterDepartment();
                                return false;
                            }
                        }
                        console.log("vm.profile.pantherID = " + vm.profile.pantherID + ", vm.pID = " + vm.pID);

                        //f (vm.user_type !=
                        reviewProfileService.updateProfileProject(vm.profile).then(function (data) {
                        });

                        var project = vm.sProject;

                        if (vm.join_type) {
                            if (vm.join_type == 'Mentor') {
                                if (project.mentor) {
                                    for (i = 0; i < project.mentor.length; i++) {
                                        if (project.mentor[i].email === vm.email) {
                                            error_msg();
                                            return;
                                        }
                                    }
                                    project.mentor.push({
                                        name: profile.firstName + " " + profile.lastName,
                                        email: profile.email
                                    });

                                }
                                else {
                                    if (vm.name && vm.email2) {
                                        project.mentor = [{
                                            name: profile.firstName + " " + profile.lastName,
                                            email: profile.email
                                        }];
                                    }
                                    else {
                                        alert('Please enter a name and a valid email this is required!');
                                        return;
                                    }
                                }
                            }
                            else {
                                if (project.faculty) {
                                    for (i = 0; i < project.faculty.length; i++) {
                                        if (project.faculty[i].email === vm.email) {
                                            error_msg();
                                            return;
                                        }
                                    }
                                    project.faculty.push({
                                        name: profile.firstName + " " + profile.lastName,
                                        email: profile.email
                                    });


                                }
                                else {

                                    project.faculty = [{
                                        name: profile.firstName + " " + profile.lastName,
                                        email: profile.email
                                    }];

                                }
                            }

                            profile.joined_project = false;

							vm.profile.project = project.title;
                            User.update({user: profile});

                            ProjectService.editProject(project, project._id).then(
                                function (response) {
                                    // success callback
                                    success_msg();

                                    var email_msg =
                                        {
                                            recipient: profile.email,
                                            text: "Thank you for applying to " + project.title + ", as either a faculty or mentor please register an account using the same email as soon as possible so people who are signed into the website can see your profile.<br/><br/>Project: " + project.title + "<br/>Status: Approved",
                                            subject: "Faculty/Mentor Application Successfull",
                                            recipient2: vm.adminEmail,
                                            text2: profile.firstName + " " + profile.lastName + " has applied to " + project.title + " as a mentor or faculty. You may remove this person from the project if he or she is not authorized to join.",
                                            subject2: "Faculty/Mentor has joined " + project.title
                                        };
                                    User.nodeEmail(email_msg);
                                },
                                function (response) {
                                    msg("Cannot Apply Reason:", response.data);
                                }
                            );
                        }
                        else {
                            for (i = 0; i < project.members.length; i++) {
                                if (project.members[i] === vm.email) {
                                    error_msg();
                                    return;
                                }
                            }

                            for (i = 0; i < project.members_detailed.length; i++) {
                                if (project.members_detailed[i] === (profile.firstName + " " + profile.lastName)) {
                                    error_msg();
                                    return;
                                }
                            }
                            profile.joined_project = false;
                            profile.modifying = 2;
							
							vm.profile.project = project.title;
                            User.update({user: profile});

                            project.members[project.members.length] = vm.email;
                            project.members_detailed[project.members_detailed.length] = profile.firstName + " " + profile.lastName;
                            ProjectService.editProject(project, project._id).then(
                                function (response) {
                                    // success callback
                                    success_msg();
                                    var todo = {
                                        owner: profile.userType,
                                        owner_id: profile._id,
                                        todo: profile.firstName + ", thank you for applying to \"" + project.title + "\". Please await notification while your application is being reviewed.",
                                        type: "personal",
                                        link: "#"
                                    };
                                    ToDoService.createTodo(todo).then(function (success) {

                                    }, function (error) {

                                    });
                                    
                                    if (profile.course) { // if user is in an imported course or in a course already then no need for approval from Pi                                    
                                        /*var todo1 = {
                                            owner: "Pi/CoPi",
                                            todo: profile.firstName + ", has applied for " + project.title,
                                            type: "student",
                                            link: "/#/reviewuser"
                                        };
                                        ToDoService.createTodo(todo1).then(function (success) {
                                        }, function (error) {
                                        });*/

                                        var email_msg =
                                            {
                                                recipient: profile.email,
                                                text: "Thank you for applying to \"" + project.title + "\"! You have until the end of the deadline to change your mind about this project. Once the deadline has passed you will have access to the final lineup of projects.<br/><br/>Project: " + project.title + "<br/>Status: Pre-Approved",
                                                subject: "Project Application Submitted",
                                                recipient2: vm.adminEmail,
                                                text2: profile.firstName + " " + profile.lastName + " has applied to project " + project.title + ". He/She has been pre-approved by the system since he/she is in a course  (" + profile.course + ")",
                                                subject2: "New Student Applied To " + project.title
                                            };
                                    }
                                    else {
                                        var todo1 = {
                                            owner: "Pi/CoPi",
                                            todo: profile.firstName + ", has applied for " + project.title + ". Please approve or reject his application",
                                            type: "student",
                                            link: "/#/reviewuser"
                                        };
                                        ToDoService.createTodo(todo1).then(function (success) {

                                        }, function (error) {
                                        });

                                        var email_msg =
                                            {
                                                recipient: profile.email,
                                                text: "Thank you for applying to \"" + project.title + "\"! Your application is currently pending and this is just a confirmation that you applied to the project please keep checking the VIP to-do or your email as the PI will approve or deny your request to join the project.<br/><br/>Project: " + project.title + "<br/>Status: Pending",
                                                subject: "Project Application Submission Pending",
                                                recipient2: vm.adminEmail,
                                                text2: profile.firstName + " " + profile.lastName + " has applied to project " + project.title + ". Please approve him/her by going to " + LocationService.vipWebUrls.reviewUser,
                                                subject2: "New Student Applied To " + project.title
                                            };
                                    }    
                                    User.nodeEmail(email_msg);

                                    // // refresh the page after 3 seconds so the user can see the message
                                    // setTimeout(function () { location.reload(true); }, 7000);
                                },
                                function (response) {
                                    msg("Cannot Apply Reason:", response.data);
                                }
                            );
                        }
                    }
                    else {
                        var project = vm.sProject;

                        if (vm.join_type) {
                            if (vm.join_type == 'Mentor') {
                                if (project.mentor) {
                                    if (vm.name && vm.email2) {

                                        for (i = 0; i < project.mentor.length; i++) {
                                            if (project.mentor[i].email === vm.email2) {
                                                error_msg();
                                                return;
                                            }
                                        }

                                        project.mentor.push({name: vm.name, email: vm.email2});
                                    }
                                    else {
                                        alert('Please enter a name and a valid email this is required!');
                                        return;
                                    }
                                }
                                else {
                                    if (vm.name && vm.email2) {
                                        project.mentor = [{name: vm.name, email: vm.email2}];
                                    }
                                    else {
                                        alert('Please enter a name and a valid email this is required!');
                                        return;
                                    }
                                }
                            }
                            else {
                                if (project.faculty) {
                                    if (vm.name && vm.email2) {
                                        for (i = 0; i < project.faculty.length; i++) {
                                            if (project.faculty[i].email === vm.email2) {
                                                error_msg();
                                                return;
                                            }
                                        }
                                        project.faculty.push({name: vm.name, email: vm.email2});
                                    }
                                    else {
                                        alert('Please enter a name and a valid email this is required!');
                                        return;
                                    }
                                }
                                else {
                                    if (vm.name && vm.email2) {
                                        project.faculty = [{name: vm.name, email: vm.email2}];
                                    }
                                    else {
                                        alert('Please enter a name and a valid email this is required!');
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            alert('Please select the type of person you would like to join the project as!');
                            return;
                        }


                        ProjectService.editProject(project, project._id).then(
                            function (response) {
                                // success callback
                                success_msg();

                                var email_msg =
                                    {
                                        recipient: vm.email2,
                                        text: "Thank you for applying to " + project.title + ", as either a faculty or mentor please register an account using the same email as soon as possible so people who are signed into the website can see your profile.<br/><br/>Project: " + project.title + "<br/>Status: Approved",
                                        subject: "Faculty/Mentor Application Successfull",
                                        recipient2: vm.adminEmail,
                                        text2: vm.name + " has applied to \"" + project.title + "\"as a mentor or faculty. You may remove this person from the project if he or she is not authorized to join.",
                                        subject2: "Faculty/Mentor has joined " + project.title
                                    };
                                User.nodeEmail(email_msg);

                                // // refresh the page after 3 seconds so the user can see the message
                                // setTimeout(function () { location.reload(true); }, 7000);
                            },
                            function (response) {
                                msg("Cannot Apply Reason:", response.data);
                            }
                        );


                    }
                }
            };

            function loading() {
                swal({
                        title: '',
                        text: 'Loading Please Wait...',
                        html: true,
                        timer: 10000,
                        showConfirmButton: false
                    }
                );
            }

            $scope.optionselected = function () {

                if ($scope.projApp.branch == '2') {
                    vm.profile.volunteer = "true";
                }
            }


            // student is missing some of the required fields
            function studentMissingFields() {
                swal({
                        title: 'Almost There!',
                        text: 'Please double check and make sure you have filled all of the required information in the form.',
                        html: true,
                        timer: 10000,
                        showConfirmButton: true
                    }
                );
            }

            // User Story #1175
            function EnterDepartment() {
                swal({
                        title: 'Almost There!',
                        text: 'Please Enter School/Department details.',
                        html: true,
                        timer: 10000,
                        showConfirmButton: true
                    }
                );
            }

            function msg(title, text) {
                swal({
                        title: title,
                        text: text,
                        type: "success",
                        confirmButtonText: "Continue",
                        allowOutsideClick: true,
                        timer: 7000,
                    }, function () {
                        window.location.reload();
                    }
                );
            }

            function success_msg() {
                swal({
                        title: "You've submitted your application!",
                        text: "Your application has been sent for faculty reviewal! You will be notified of updates via email.",
                        type: "success",
                        confirmButtonText: "Continue",
                        allowOutsideClick: true,
                        timer: 7000,
                    }, function () {
                        $window.location.href = "/#/vip-projects-detailed/" + vm.sProject._id
                    }
                );
            }

            function error_msg() {
                swal({
                        title: "Oops!",
                        text: "It seems that you have already joined or applied to this project.",
                        type: "warning",
                        confirmButtonText: "Ok",
                        allowOutsideClick: true,
                        timer: 7000,
                    }, function () {
                        window.location.reload();
                    }
                );
            }
        });
}());