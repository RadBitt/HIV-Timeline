d = document;

$(document).ready(function() {
    $('iframe.goog-te-menu-frame').remove()
    $('#google_translate_element').prev().remove();
    $('#google_translate_element').remove();

    // replace google search icon
    $('.gsc-search-button').addClass('glyphicon');
    $('.gsc-search-button').removeClass('.gsc-search-button');
    $('.gsc-search-button-v2').addClass('glyphicon-search');
    $('.gsc-search-button-v2').removeClass('.gsc-search-button-v2');

    if (window.innerWidth < 1200) {

        var parentDiv = d.getElementById('hiv-timeline-container');
        var filterDiv = d.getElementById('filter-container');
        var timelineContainer = d.getElementById('timeline-container');

        if(timelineContainer.length != null)
            parentDiv.insertBefore(filterDiv, timelineContainer);

    }

});

$(window).scroll(function() {

    var timelineContainer = d.getElementById('timeline-container');

    if(timelineContainer != null) {
        if (window.innerWidth <= 900) {
            if ($(window).scrollTop() > 50){
                $('nav').css({marginBottom: '51px'});
                $('#event-viewer-container').css({position: 'fixed', top: 0});
            } else {
                $('nav').css({marginBottom: '0'});
                $('#event-viewer-container').css({position: 'relative', top: 'initial'});
            }
        }

    }

 });

function navHighlight()
{
    //  Gets the pathname of current URL, omitting the leading forward slash
    var active = window.location.pathname;
    // for deployment:
    // active = active.slice(31);
    // active = active.split('.')[0];
    active = active.split('/')[3];
    active = active.split('.')[0];

    //  If pathname is '', home gets hard coded active class
    //  Basically hard-coded switch cases for the drop-down pages, because their path name
    //  does not match the ID they have.
    //  the cases with pages with matching IDs and pathnames are caught at the end


    if (active == "index")
    {
        d.getElementById("home").style.borderTopColor = "#4B90E0";
    }
    else if (active == "about" || active == "classes")
    {
        replaceTitle();
        d.getElementById(active).style.borderTopColor = "#4B90E0";
    }

    else if (active == "support" || active == "testing")
    {
        replaceTitle();
        d.getElementById("services").style.borderTopColor = "#4B90E0";
    }

    else if (active == "aboutHIV" || active == "prevention" || active == "videos")
    {
        replaceTitle();
        d.getElementById("information").style.borderTopColor = "#4B90E0";
    }

    else if (active == "partners" || active == "advocacy")
    {
        replaceTitle();
        d.getElementById("community").style.borderTopColor = "#4B90E0";
    }
    else
    {
        active = 'home';
        d.getElementById(active).style.borderTopColor = "#4B90E0";
    }

    function setBorderTop() {
        
    }

    function replaceTitle() {
        d.title = active.charAt(0).toUpperCase() + active.slice(1) + ' | ' + d.title;
    }

}
