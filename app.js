'use strict';

var contactApp = angular.module('contactApp', ['ngRoute', 'LocalStorageModule'])


// route config
.config(function($routeProvider, $locationProvider) {
    $routeProvider

    //Route for default home page
    .when('/', {
      templateUrl: 'home.html'
    })

    // Route for Add Page
    .when('/add', {
      templateUrl: 'add.html',
      controller: 'contactCtrl'
    })

    // Route for Edit Page
    .when('/edit/:id', {
      templateUrl: 'edit.html',
      controller: 'contactCtrl'
    })

    // Route for Details Page 
    .when('/:id', {
      templateUrl: 'details.html',
      controller: 'contactDetailsCtrl'
    })

    // Redirect to home page
    .otherwise({redirectTo: '/home'});
})

// Controllers
.controller('contactCtrl', function ($scope, $routeParams, ContactService) {


  // Get the contacts from ContactService
  var contacts = ContactService.get();

  $scope.contactList = contacts || [];

  // Watch for changes on $scope.contactList 
  //so that localStorage contactList is kept in sync
  $scope.$watch('contactList', function() {
    ContactService.set($scope.contactList);
  }, true);


  // Phone pattern to match
  $scope.phonePattern = /\d{3}\-\d{3}\-\d{4}/;

  // Reset Form 
  $scope.cancelChange = function () {
    $scope.currentContact = {};
  }
  
  // Save contact
  $scope.saveContact = function() {
          ContactService.save($scope.currentContact);
          $scope.currentContact = {};  
          $scope.contactform.$setPristine();     
    }

  // Delete contact
  $scope.deleteContact = function (id) {
    ContactService.delete(id)
    $scope.currentContact = {};
  }

  // Show Edit Page
  $scope.editPage = function (contact) {

    $scope.contactCopy = angular.copy(contact);

    // Change the date string back to date object
    var birthday = new Date($scope.contactCopy.birthday);
    $scope.contactCopy.birthday = birthday;

  }

  // Save edited changes 
  $scope.editContact = function (contactCopy) {
    ContactService.edit(contactCopy);
    $scope.editform.$setPristine();
    $scope.contactCopy = {};
  }

      // Add Profile Picture
    $scope.filesChangedSaved = function(elm) {
      var files = elm.files;
      $scope.$apply();
      var img = '';

      var reader = new FileReader();
      reader.onload = function(e) {
        img = e.target.result;
        $scope.currentContact.img = img;
      }
      reader.readAsDataURL(files[0]); 
    }


      // Edit Profile Picture
    $scope.filesChangedEdited = function(elm) {
      var files = elm.files;
      $scope.$apply();
      var img = '';

      var reader = new FileReader();
      reader.onload = function(e) {
        img = e.target.result;
        $scope.contactCopy.img = img;
      }
      reader.readAsDataURL(files[0]); 
    }

})
  // Show Contact Details
.controller('contactDetailsCtrl', function ($scope, $routeParams) {
  var index = $routeParams.id;
  $scope.currentContact = $scope.contactList[index];
})

// Contact Service
.service('ContactService', function(localStorageService) {

// Get Contact List from localStorage
  var contactList = localStorageService.get('contactList');
  
  // Get a list of all contacts
  this.get = function() {
    return contactList;
  }

  // Set the contacts 
  this.set = function(contactList) {
    localStorageService.set('contactList', contactList);
  }


  // Add Contact
  this.save = function (currentContact) {
            var id = contactList.length;
            currentContact.id = id++;
            contactList.push(currentContact);

  }

  // Save Edited Changes
  this.edit = function (contactCopy) {
       for (var i = 0; i < contactList.length; i++) {
        if (contactCopy.id == contactList[i].id) {
            contactList[i] = contactCopy;
        }
      }
  }

  // Delete 
  this.delete = function (id) {
    for (var i = 0; i < contactList.length; i++) {
      if (id === contactList[i].id) {
        contactList.splice(i, 1);
      }
    }
  }


});












