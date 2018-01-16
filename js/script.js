window.onload = function () {
    var dialog = document.querySelector(".dialog");
	var input = document.querySelector("#search-input");
    var more_info = document.querySelector(".more_info");
    input.value = "";
    var map;
    var geo;
	input.addEventListener("keyup", function () {
        var myExp = new RegExp(input.value, "i");
        dialog.innerHTML= "";
        if(input.value.length > 1){
            ajaxGet('js/getDivisions.json', myExp);
        } else {
            dialog.classList.remove("open");
        }

    });
    
    function ajaxGet(url, myValue) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status != 200) {
            console.log( xhr.status + ': ' + xhr.statusText ); 
        } else {
            var otvet = JSON.parse(xhr.responseText);

            otvet.result.map(function(elem) {
                var newElement = document.createElement('div');
                if(elem.NAME_DIV.search(myValue) != -1){
                    dialog.classList.add("open");
                    newElement.innerHTML = elem.NAME_DIV;
                    dialog.appendChild(newElement); 
                } 
                newElement.addEventListener("click", function () {
                    input.value = "";
                    more_info.innerHTML = "";
                    dialog.classList.remove("open");
                    var newPost = document.createElement('div');
                    newPost.innerHTML ="<h1>"+ elem.CODE_DIV +"</h1><h1>"+ elem.ABBR_DIV +"</h1><h1>" + elem.NAME_DIV + "</h1><p>" + elem.ADDRESS + "</p>"
                    function init () {
                        geo = new google.maps.Geocoder();
                        var opt = {
                            zoom: 15 
                        };
                        
                        map = new google.maps.Map(document.querySelector("#map"), opt);
                        geo.geocode({'address': elem.ADDRESS}, function (results, status) {
                            if(status == google.maps.GeocoderStatus.OK){
                                map.setCenter(results[0].geometry.location);
                                var marker = new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location
                                });
                            } else {
                                alert("Неправильный адресс");
                            }
                        });
                    }
                    init ();
                    more_info.appendChild(newPost);
                });
            });
        }
    }
}