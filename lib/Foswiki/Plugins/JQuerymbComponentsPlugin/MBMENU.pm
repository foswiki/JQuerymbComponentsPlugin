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

  my $this = bless($class->SUPER::new( 
    $session,
    name => 'mb.Menu',
    version => '2.7.2',
    author => 'Matteo Bicocchi',
    homepage => 'http://code.google.com/p/mbideasproject/wiki/mbmenu',
    documentation => "$Foswiki::cfg{SystemWebName}.JQuerymbMenu",
    puburl => '%PUBURLPATH%/%SYSTEMWEB%/JQuerymbComponentsPlugin/jquery.mb.menu.2.7.2',
    javascript => ['inc/jquery.metadata.js', 'inc/mbMenu.js', 'inc/jquery.hoverIntent.js']
  ), $class);

  return $this;
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
