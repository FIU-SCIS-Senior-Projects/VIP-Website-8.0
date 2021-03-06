(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsCtrl', VIPProjectsCtrl);

    VIPProjectsCtrl.$inject = ['$sce', '$state', '$scope', 'ProjectService', 'adminService', 'DateTimeService'];
    /* @ngInject */
    function VIPProjectsCtrl($sce, $state, $scope, ProjectService, adminService, DateTimeService) {
        //Variable Declarations
        var vm = this;
        var projectsArray = [];
        vm.projects;
        vm.disciplines;
        vm.backupProjects;
        vm.backupDisciplines;
        vm.temProj = new Set();
        vm.filteringVariables = new Set();
        vm.showAllCheckBox = true;
        vm.done = false;
        vm.printFriendlyView = false;
        vm.printFriendlyViewButtonText1 = "PROJECTS/TEAMS";
        vm.printFriendlyViewButtonText2 = "final lineup";
        vm.printFriendlyViewfunc = printFriendlyViewfunc;
        //Function Declarations
        vm.showAllDisciplinesToggle = showAllDisciplinesToggle; 
        vm.filterByDiscipline = filterByDiscipline;
        vm.viewDetails = viewDetails;
        vm.modalLink = modalLink;
        var selectedFilter = null;
        vm.filteredprojects;
        $scope.iFrameURLModal = null;
        $scope.projectidModal = null;
        vm.setVideoModal = function (url, projectid) {
            $scope.iFrameURLModal = $sce.trustAsResourceUrl(url);
            $scope.projectidModal = projectid;
        }

        function modalLink (data) {
            $state.go('projectsDetailed',{id: data});
        }
        
         vm.filters = [
            
            {
                name: '(A-Z)',
            },
            {
                name: '(Z-A)',
            },

            
        ];
        
        $scope.applyFilter = function()
        {
            selectedFilter = $scope.selectedFilter.name;
            
            //alert("we select the filter " + selectedFilter);
            
            switch (selectedFilter)
            {
                  case '(A-Z)':
                    var tempProj = [];
                    tempProj = vm.projects;
                    tempProj.sort(function(a, b)
                    {
                        if (b.title.toLowerCase() > a.title.toLowerCase()) return -1;
                        if (b.title.toLowerCase() < a.title.toLowerCase()) return 1;
                        return 0;
                    })
                    
                    vm.filteredprojects = tempProj;
                    break;


                case '(Z-A)':
                    var tempProj = [];
                    tempProj = vm.projects;
                    tempProj.sort(function(a, b)
                    {
                        if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
                        if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
                        return 0;
                    })
                    
                    vm.filteredprojects = tempProj;
                    break;
					
                default:
                    alert('no filter for this option');
                    //$location.url('/#en');
            }
            //$translate.use(langKey);
          }
        
        
        init();
        function init(){
            loadData();
        }
        
        function checkBoxChange () {
            if(vm.filteringVariables.size > 0)
                document.getElementById("showAll").indeterminate = true;
            else
                document.getElementById("showAll").indeterminate = false;
        }
        
        function loadData(){
            ProjectService.getProjects().then(function(data){
                bubbleSort(data, 'title');
                vm.disciplines = getDisciplines(data);
                vm.projects = data;
                vm.filteredprojects = data;
                vm.backupProjects = vm.projects;
                vm.backupDisciplines = vm.disciplines;
				vm.done = true;
            });
        }
        
        function showAllDisciplinesToggle() {
            if(vm.showAllCheckBox){
                vm.projects = vm.backupProjects;
                vm.disciplines = getDisciplines(vm.backupProjects);
            }else {
                vm.projects = [];
                vm.disciplines = [];
            }
            vm.filteringVariables.clear();
        }
        
        function filterByDiscipline (discipline) {
            vm.temProj.clear();
            if(discipline != null) {
                /*
                * Find if discipline already being displayed, in which case it will be discarded as a filtering option.
                * and the remaining filters have to be reapplied to all the projects. NEEDS REVISION for IMPROVEMENT
                */
                if(vm.filteringVariables.has(discipline)){
                    vm.filteringVariables.delete(discipline);
                    filterProjects(vm.filteringVariables, vm.backupProjects);
                }
                else{
                    var disciplineSet = new Set();
                    disciplineSet.add(discipline);
                    vm.filteringVariables.add(discipline);
                    filterProjects(disciplineSet, vm.projects);
                }
                checkBoxChange();
            }
        } 
        
        function viewDetails (data) {
            $state.go('projectsDetailed',{id: data._id});
        }

        function printFriendlyViewfunc () {
            adminService.getAdminSettings().then(function (data) {
                if (!vm.printFriendlyView) {
                    var projectDeadlineStartDate = null;
                    var projectDeadlineEndDate = null;
                    projectDeadlineStartDate = data.projectDeadlineStartDate;
                    projectDeadlineEndDate = data.projectDeadlineEndDate;

                    if (projectDeadlineStartDate != null && projectDeadlineEndDate != null) {
                        var dtoday = new Date();
                        var dstart = new Date(projectDeadlineStartDate);
                        var dend = new Date(projectDeadlineEndDate);
                        if (dtoday.valueOf() < dend.valueOf()) {
                            swal({
                                title: "Not Available!",
                                text: "Project teams are only available after deadline end date.\n" +
                                    "Application Start date: " + dstart.toLocaleDateString() + "\n" +
                                    "Application End date: " + dend.toLocaleDateString() + "\n",
                                type: "info",
                                confirmButtonText: "Okay",
                                allowOutsideClick: false,
                                timer: 60000,
                            }
                            );
                            return;
                        }
                    }
                    else {
                        swal({
                            title: "Not Available!",
                            text: "The deadline for Students to apply/leave a project is not set.",
                            type: "info",
                            confirmButtonText: "Okay",
                            allowOutsideClick: false,
                            timer: 60000,
                        }
                        );
                        return;
                    }
                }
                vm.printFriendlyView = !vm.printFriendlyView;
                if (!vm.printFriendlyView) {
                    vm.printFriendlyViewButtonText1 = "PROJECTS/TEAMS";
                    vm.printFriendlyViewButtonText2 = "final lineup";   
                }
                else  {
                    vm.printFriendlyViewButtonText1 = "PROJECTS CARD VIEW";
                    vm.printFriendlyViewButtonText2 = "(go back)";
                }
            });
        }
        
        function bubbleSort(a, par)
        {
            var swapped;
            do {
                swapped = false;
                if(par != null && par != ''){
                    for (var i = 0; i < a.length - 1; i++) {
                        if (a[i][par] > a[i + 1][par]) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            swapped = true;
                        }
                    }
                }
                else {
                    for (var i = 0; i < a.length - 1; i++) {
                        if (a[i] > a[i + 1]) {
                            var temp = a[i];
                            a[i] = a[i + 1];
                            a[i + 1] = temp;
                            swapped = true;
                        }
                    }
                }
            } while (swapped);
        }
        
        function getDisciplines(projects) {
            var disciplines = new Set();
            var tempArray = [];
            angular.forEach(projects, function(value){
                angular.forEach(value.disciplines, function(discipline){
                    var obj = {title:discipline};
                    disciplines.add(discipline);
                })
            })
            disciplines.forEach(function(obj){
                tempArray.push(obj);
            })
            bubbleSort(tempArray,null);
            return tempArray;
        }
        
        function filterProjects(discipline, projects){
            var tempArray = [];
            discipline.forEach(function (obj){
                tempArray.push(obj);
            })
            angular.forEach(tempArray, function(obj) {
                angular.forEach(projects, function(item){
                    angular.forEach(item.disciplines, function(itemDiscipline){
                        if(itemDiscipline === obj)
                        {
                            vm.temProj.add(item);
                        }    
                    })
                })
                projects = [];
                vm.temProj.forEach(function (proj) {
                    projects.push(proj);
                });    
                vm.temProj.clear();
            });
            
            vm.projects = [];
            angular.copy(projects, vm.projects);
            bubbleSort(vm.projects, 'title');
            vm.disciplines = getDisciplines(vm.projects);
        }
    }
})();