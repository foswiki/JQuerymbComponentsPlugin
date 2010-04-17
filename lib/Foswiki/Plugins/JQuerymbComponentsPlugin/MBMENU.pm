# See bottom of file for default license and copyright information

package Foswiki::Plugins::JQuerymbComponentsPlugin::MBMENU;
use strict;
use warnings;
use Foswiki::Plugins::JQueryPlugin::Plugin;
our @ISA = qw( Foswiki::Plugins::JQueryPlugin::Plugin );

=begin TML

---+ package Foswiki::Plugins::JQuerymbComponentsPlugin::MBMENU
---++ ClassMethod new( $class, $session, ... )

Constructor

=cut

sub new {
    my $class = shift;
    my $session = shift || $Foswiki::Plugins::SESSION;

    my $this = bless(
        $class->SUPER::new(
            $session,
            name          => 'mb.Menu',
            version       => '2.8.1-sven',
            author        => 'Matteo Bicocchi',
            homepage      => 'http://wiki.github.com/pupunzi/jquery.mb.menu/',
            documentation => "$Foswiki::cfg{SystemWebName}.JQuerymbMenu",
            puburl =>
'%PUBURLPATH%/%SYSTEMWEB%/JQuerymbComponentsPlugin/jquery.mb.menu',
            javascript => [
                'inc/jquery.metadata.js', 'inc/mbMenu.js',
                'inc/jquery.hoverIntent.js'
            ]
        ),
        $class
    );

    Foswiki::Func::registerTagHandler( 'MENU',       \&MENU );
    Foswiki::Func::registerTagHandler( 'ENDMENU',    \&ENDMENU );
    Foswiki::Func::registerTagHandler( 'MENUITEM',   \&MENUITEM );
    Foswiki::Func::registerTagHandler( 'SUBMENU',    \&SUBMENU );
    Foswiki::Func::registerTagHandler( 'ENDSUBMENU', \&ENDSUBMENU );

    return $this;
}

=begin TML

---++ ClassMethod MENU( $this, $params, $topic, $web ) -> $result

The header constructor doesn't need to be a table; it needs to be grouped with a block element (like a DIV) that define the whole component.

 <div class="myMenu">
    ...
 </div>

How to define which is the submenu that has to be opened:

with jquery.metadata.plugin: Add a class attribute where to pass the "menu" as JSON parameter with the ID of the menu element.

    ...
    <td class="[cssClass] {menu: '[menu_ID]'}">[menuTitle]</td>
    ...

without jquery.metadata.plugin: Add an attribute "menu" with the ID of the menu element.

    ...
    <td class="[cssClass]" menu="[menu_ID]">[menuTitle]</td>
    ...

Setting "empty" as value of the "menu" attribute no submenu'll be shown

    ...
    <td class="[cssClass] {menu: 'empty'}" onclick="doSomething">[menuTitle]</td>

=cut

sub MENU {
    my ( $this, $params, $theTopic, $theWeb ) = @_;

    my $name     = $params->{name};
    my $extraCss = $params->{css};

    #TODO: need to de-hardcode the js - is only works on 'myMenu' atm

#  Foswiki::Func::addToZone( "body", 'mbMenu::menu_red','<link rel="stylesheet" href="%PUBURLPATH%/%SYSTEMWEB%/JQuerymbComponentsPlugin/jquery.mb.menu/css/menu_red.css" type="text/css"/>');
    Foswiki::Func::addToZone(
        "body",
        'mbMenu::menu_red_' . $name,
        '<link rel="stylesheet" href="' . $extraCss . '" type="text/css"/>'
    );
    Foswiki::Func::addToZone(
        "body",
        'mbMenu::simple_js',
'<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/JQuerymbMenu/example.js"></script>',
        'JQUERYPLUGIN::MB.MENU'
    );

    return "
<div class=\"mbMenuRoot\" id=\"$name\">
  <!-- start horizontal menu -->
  <div class=\"rootVoices\" >";
}

=begin TML

---++ ClassMethod ENDMENU( $this, $params, $topic, $web ) -> $result


=cut

sub ENDMENU {
    my ( $this, $params, $theTopic, $theWeb ) = @_;

    return "</div>
  <!-- end horizontal menu -->
</div>";
}

=begin TML

---++ ClassMethod MENUITEM( $this, $params, $topic, $web ) -> $result

       <div id="[menu_ID]" class="mbmenu">
        <a rel="title">[title of the menu]</a>
        <a rel="text" >[content of a text menu voice (can contains forms, images or whatever you whant)]</a>
        <a rel="separator"></a>
        <a class="{action: '[doSomething()]', img: '[imageURL]'}">[label]</a>
        <a id="[lineID]" class="{menu:'sub_menu_2'}" >[label]</a>
        <a id="[lineID]" class="{menu:'sub_menu_2', action: '[doSomething()]'}" >[label]</a>
        <a href="[someURL]" target="blank">[label]</a>
        <a class="{disabled:true}">[label]</a>
       </div>

If you are not using jquery.metadata.plugin intead of declaring params inside the class you should create single attribute for each pram: for Ex:

        <a class="{action: '[doSomething()]', img: '[imageURL]'}">[label]</a>

should be written:

        <a action='[doSomething()]' img='[imageURL]'>[label]</a>

=cut

sub MENUITEM {
    my ( $this, $params, $theTopic, $theWeb ) = @_;

    my $title  = $params->{_DEFAULT} || '';
    my $menu   = $params->{menu};
    my $img    = $params->{img};
    my $action = '';            #not sure why the action: attribute isn't working for me - TODO
    $action = 'onclick="'.$params->{action}.'" ' if ( defined( $params->{action} ) );
    my $href   = '';
    $href = 'href="' . $params->{href} . '" ' if ( defined( $params->{href} ) );
    my $type = $params->{type};
    my $cssClass  = $params->{css} || '';

    my @jsonAttr = ();
    foreach my $key (qw/menu img/) {
        if ( defined( $params->{$key} ) ) {
            push( @jsonAttr, "$key: '" . $params->{$key} . "'" );
        }
    }

    my $relAttr = '';
    $relAttr = "rel=\"$type\" " if ( defined($type) );

    my $tmpl = "<a " . $relAttr . $href . $action

      #TODO: add href for non-js
      . "class=\"rootVoice $cssClass {" . join( ', ', @jsonAttr ) . "}\" >$title</a>";
    return $tmpl;
}

=begin TML

---++ ClassMethod ENDSUBMENU( $this, $params, $topic, $web ) -> $result


=cut

sub SUBMENU {
    my ( $this, $params, $theTopic, $theWeb ) = @_;

    my $name = $params->{name};
    my $type = $params->{type} || '';
    if ( $type ne '' ) {
        $type = "type=\"$type\"";
    }

    return '<div id="' . $name . '" class="mbmenu" ' . $type . ' >';
}

=begin TML

---++ ClassMethod ENDSUBMENU( $this, $params, $topic, $web ) -> $result


=cut

sub ENDSUBMENU {
    my ( $this, $params, $theTopic, $theWeb ) = @_;

    return '</div>';
}

1;
__END__
This copyright information applies to the JQuerymbComponentsPlugin:

Plugin for Foswiki - The Free and Open Source Wiki, http://foswiki.org/

JQuerymbComponentsPlugin is Copyright (C) 2009-2010 SvenDowideit@fosiki.com
 
This license applies to JQuerymbComponentsPlugin and to any derivatives.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

For licensing info read LICENSE file in the root of this distribution.
