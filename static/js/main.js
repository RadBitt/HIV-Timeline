function navHighlight()
{
    //  Gets the pathname of current URL, omitting the leading forward slash
    var active = window.location.pathname;
    active = active.slice(14);
    console.log(active);


    //  If pathname is '', home gets hard coded active class
    //  Basically hard-coded switch cases for the drop-down pages, because their path name
    //  does not match the ID they have.
    //  the cases with pages with matching IDs and pathnames are caught at the end

    if (active == "index.php")
    {
            // document.getElementById("home").setAttribute("class", "active");
        //  console.log("hit home case");
        document.getElementById("home").style.borderTopColor = "#4B90E0";
    }

    else if (active == "support.php" || active == "testing.php")
    {
        //  console.log("before services");
        // document.getElementById("services").setAttribute("class", "active");
        document.getElementById("services").style.borderTopColor = "#4B90E0";
    }

    else if (active == "aboutHIV.php" || active == "prevention.php" || active == "videos.php")
    {
        document.getElementById("information").style.borderTopColor = "#4B90E0";
        // document.getElementById("information").setAttribute("class", "active");
        //  console.log("hit info");
    }
    else if (active == "partners.php" || active == "advocacy.php")
    {
        document.getElementById("community").style.borderTopColor = "#4B90E0";
    }
    else
    {
        document.getElementById(active).style.borderTopColor = "#4B90E0";
        // document.getElementById(active).style.borderTop = "2px solid #4B90E0";
        // document.getElementById(active).setAttribute("class", "active");
        //  console.log("hit else statement");
    }
}

$(document).ready(function() {
    $('iframe.goog-te-menu-frame').remove()
    $('#google_translate_element').prev().remove();
    $('#google_translate_element').remove();

});


// function navHighlight()
// {
//     //  Gets the pathname of current URL, omitting the leading forward slash
//     var active = window.location.pathname;
//     active = active.slice(1);
//     //  console.log(active);


//     //  If pathname is '', home gets hard coded active class
//     //  Basically hard-coded switch cases for the drop-down pages, because their path name
//     //  does not match the ID they have.
//     //  the cases with pages with matching IDs and pathnames are caught at the end


//     if (active === "index.html")
//     {
//             // document.getElementById("home").setAttribute("class", "active");
//         //  console.log("hit home case");
//         document.getElementById("home").style.borderTopColor = "#4B90E0";
//     }

//     else if (active == "support.html" || active == "testing.html")
//     {
//         //  console.log("before services");
//         // document.getElementById("services").setAttribute("class", "active");
//         document.getElementById("services").style.borderTopColor = "#4B90E0";
//     }

//     else if (active == "aboutHIV.html" || active == "prevention.html" || active == "videos.html")
//     {
//         document.getElementById("information").style.borderTopColor = "#4B90E0";
//         // document.getElementById("information").setAttribute("class", "active");
//         //  console.log("hit info");
//     }
//     else
//     {
//         active = active.split(".")[0];
//         document.getElementById(active).style.borderTopColor = "#4B90E0";
//         // document.getElementById(active).style.borderTop = "2px solid #4B90E0";
//         // document.getElementById(active).setAttribute("class", "active");
//         //  console.log("hit else statement");
//     }
// }
