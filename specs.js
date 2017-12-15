var progdb;
function DBErrorHandler(ex) {
    alert("DB Error: " + ex);
}
function Initializer(){
    window.planObjs = [];
    if (navigator.storage && navigator.storage.persist){
        navigator.storage.persist().then(granted => {
            if (!granted)
                document.getElementById('savedDataMessage').classList.remove('hidden'); //alert("Storage will not be cleared except by explicit user action");
            /*
            else
                alert("Storage may be cleared by the UA under storage pressure.");*/
        });
    }
    var request = indexedDB.open("progdb", 1);
    request.onerror = function (event){
        DBErrorHandler(event.target);
    }
    request.onupgradeneeded = function (event) {
        //alert('create start');
        request.result.createObjectStore('prog', { autoIncrement: true });
        //alert('end create');
    }
    request.onsuccess = function (event) {
        progdb = request.result;
        //alert('open success');
        objs = progdb.transaction('prog').objectStore('prog').getAll();
        objs.onsuccess = function () {
            if (objs.result && objs.result.length > 0 && objs.result[0].length > 0) {
                window.planObjs = objs.result[0];
                
            }
        }
    }
}

function clear() {
    progdb.transaction('prog', 'readwrite').objectStore('prog').clear();
}

function RemovePassage() {
    progdb.transaction('prog', 'readwrite').objectStore('prog').add(planObjs);
}
