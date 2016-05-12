<?php

$deployment = false;

if ($deployment)
  $ext = '.html';
else
  $ext = '.php';

?>

<html>
    <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <!-- External CSS files FOR ALL pages are referenced here -->
        <link href='http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="static/css/lib/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="static/css/main.css" />
        <!-- Head_CSS Block End -->

        <!-- External JS files FOR ALL pages are referenced here -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
        <script type="text/javascript" src="static/js/lib/bootstrap.min.js"></script>
        <script type="text/javascript" src="static/js/main.js"></script>
        <!-- Head_JS Block End -->

    </head>
    <body>

        <!-- Content Block Begin -->

          <!-- Header Block Begin -->
          <nav class="navbar navbar-default">
            <div class="container-fluid">

              <!-- Brand and toggle get grouped for better mobile display aka hamburger menu -->
              <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" href="index.php">
                  <img alt="Brand" src="static/img/icons/logo.png">
                </a>
              </div>

              <!-- Collect the nav links, forms, and other content for toggling -->
              <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                  <li id="home"><a href="index<?php echo $ext ?>">home<span class="sr-only">(current)</span></a></li>

                  <li id="about"><a href="about<?php echo $ext ?>">about us</a></li>

                  <li class="dropdown services" id="services">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">services<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                      <li><a href="support<?php echo $ext ?>">community support</a></li>
                      <li><a href="testing<?php echo $ext ?>">testing</a></li>
                    </ul>
                  </li>

                  <li class="dropdown information" id="information">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">information<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                      <li><a href="aboutHIV<?php echo $ext ?>">about HIV</a></li>
                      <li><a href="prevention<?php echo $ext ?>">prevention</a></li>
                      <li><a href="videos<?php echo $ext ?>">videos</a></li>
                    </ul>
                  </li>

                  <li class="dropdown community" id="community">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">community<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                      <li><a href="partners<?php echo $ext ?>">partners</a></li>
                      <li><a href="advocacy<?php echo $ext ?>">advocacy</a></li>
                    </ul>
                  </li>

                  <li id="classes"><a href="classes<?php echo $ext ?>">classes</a></li>

                  <li id="searchBox">
                    <form action="" class="search-form">
                      <div class="form-group has-feedback">
                    		<label for="search" class="sr-only">Search</label>
                    		<input type="text" class="form-control" name="search" id="search" placeholder="search">
                    		<span id="searchBoxIcon" class="glyphicon glyphicon-search form-control-feedback"></span>
                    	</div>
                    </form>

                  </li>

                </ul>
              </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->

          </nav>
            <script type="text/javascript">
              // navHighlight();
            </script>

          <!-- Header Block End -->
