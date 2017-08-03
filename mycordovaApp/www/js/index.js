/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app;
app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        window.addEventListener("orientationchange", function () {
            alert("the orientation of the device is now " + screen.orientation.angle);
        });
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        document.getElementById("btncamera").addEventListener("click", this.makePicture);
        document.getElementById("btnsave").addEventListener("click", this.savePicture);
        document.getElementById("btnbattery").addEventListener("click", this.readBatteryLevel);
        document.getElementById("btnsetcontact").addEventListener("click", this.setContact);
        document.getElementById("btngetcontact").addEventListener("click", this.getContact);


    },

    makePicture: function () {
        navigator.camera.getPicture(onSuccess, onFail, {quality: 50, destinationType: Camera.DestinationType.FILE_URI});

        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            if (imageURI.startsWith("file")) {
                image.src = imageURI
            } else {
                image.src = "data:image/jpeg;base64," + imageURI;
            }
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },

    savePicture: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            console.log('file system open: ' + fs.name);
            fs.root.getFile("picture.txt", {create: true, exclusive: false}, function (fileEntry) {

                console.log("fileEntry is file?" + fileEntry.isFile.toString());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                writeFile(fileEntry, "test");

            }, onError);

        }, onError);

        function writeFile(fileEntry, dataObj) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function () {
                    console.log("Successful file write...");
                    readFile(fileEntry);
                };

                fileWriter.onerror = function (e) {
                    console.log("Failed file write: " + e.toString());
                };

                // If data object is not passed in,
                // create a new Blob instead.
                if (!dataObj) {
                    dataObj = new Blob(['some file data'], {type: 'text/plain'});
                }

                fileWriter.write(dataObj);
            });
        }

        function readFile(fileEntry) {

            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function () {
                    console.log("Successful file read: " + this.result);
                    //displayFileData(fileEntry.fullPath + ": " + this.result);
                };

                reader.readAsText(file);

            }, onError);
        }

        function onError(err) {
            console.log(error);
        }
    },

    readBatteryLevel: function () {

        window.addEventListener("batterystatus", onBatteryStatus, false);

        function onBatteryStatus(status) {
            alert("Level: " + status.level + " isPlugged: " + status.isPlugged);
        }

        window.addEventListener("batterylow", onBatteryLow, false);

        function onBatteryLow(status) {
            alert("Battery Level Low " + status.level + "%");
        }


    },


    setContact: function () {
        function onSuccess(contact) {
            alert("Save Success");
        };

        function onError(contactError) {
            alert("Error = " + contactError.code);
        };

        // create a new contact object
        var contact = navigator.contacts.create();
        contact.displayName = "Plumber";
        contact.nickname = "Plumber";            // specify both to support all devices

        // populate some fields
        var name = new ContactName();
        name.givenName = "Jane";
        name.familyName = "Doe";
        contact.name = name;

        // create a new contact object
        var contact = navigator.contacts.create();
        contact.displayName = "Meier";
        contact.nickname = "Meier";            // specify both to support all devices

        // populate some fields
        var name = new ContactName();
        name.givenName = "Alex";
        name.familyName = "Meier";
        contact.name = name;

        // save to device
        contact.save(onSuccess, onError);
    },

    getContact: function () {

        // find all contacts with 'Bob' in any name field
        var options = new ContactFindOptions();

        options.multiple = true;
        //   options.desiredFields = [navigator.contacts.fieldType.id];
        //     options.hasPhoneNumber = true;

        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, onSuccess, onError, options);

        function onSuccess(contacts) {
            alert('Found ' + contacts.length + ' contacts.');
        };

        function onError(contactError) {
            alert('onError!');
        };
    }
};

app.initialize();