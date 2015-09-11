// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage.projects;
      if (projectString) {
        return angular.fromJson(projectString);
      }

      return [];
    },

    save: function(projects) {
      window.localStorage.projects = angular.toJson(projects);
    },

    delete: function(projects) {
      window.localStorage.removeItem(projects);
    },

    newProject: function(projectTitle) {
      //Add a new project
      return {
        title: projectTitle,
        tasks: [],
      };
    },

    getLastActiveIndex: function() {
      return parseInt(window.localStorage.lastActiveProject) || 0;
    },

    setLastActiveIndex: function(index) {
      window.localStorage.lastActiveProject = index;
    },
  };
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  // A utility function for deleting a project once finsihed
  var deleteProject = function(projectTitle) {
    Projects.delete(projectTitle);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the lastactive, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given Project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  //Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  },

  {
    scope: $scope,
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task) {
      return;
    }

    $scope.activeProject.tasks.push({
      title: task.title,
    });
    $scope.taskModal.hide();

    // Innefficient, but save all the projects
    Projects.save($scope.projects);
    task.title = '';
  };

  $scope.deleteTask = function(task) {
    //if (!$scope.activeProject || !task) {
    //  return;
    //}

    $scope.activeProject.tasks.pop({
      title: task.title,
    });

    // Innefficient, but save all the projects
    Projects.save($scope.projects);
    task.title = '';
  };

  // Open the new task Modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  //Close the new task Modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if ($scope.projects.lenght == 0) {
      while (true) {
        var projectTitle = prompt('Your first project title: ');
        if (projectTitle) {
          createproject(projectTitle);
          break;
        }
      }
    }
  });

});
