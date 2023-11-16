---
layout: post

title: Github Markdown Test File
title-url:
subtitle: A test file I am using to determine some of the edge cases in Github Markdown
subtitle-url:
quote:
excerpt: 
source:
source-url:
call-to-action:

date: 2023-11-16 07:56:09
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512d=mpr=g
    name: Ted Tschopp
    url: https://tedt.org

bullets:

description: I am attempting to overlay Bootstrap 5.3 on top of Github's Jekyll rendering.  This is to test out some edge cases.
seo-description: I am attempting to overlay Bootstrap 5.3 on top of Github's Jekyll rendering.  This is to test out some edge cases.

categories:
- Computers
tags:
keywords: 

draft-status:

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709


image:
image-alt:
image-author:
image-author-URL:
image-credits:
image-credits-URL:
image-credits-artist:
image-credits-artist-URL:
image-credits-title:
image-description:
image-title:

monster-or-magical-or-religious-ideas:
year-the-event-took-place:



mathjax:

order:
---
# Headers

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------

------

# Emphasis

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~

------

# Lists

1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses

1. Make my changes
    1. Fix bug
    2. Improve formatting
        - Make the headings bigger
2. Push my commits to GitHub
3. Open a pull request
    * Describe my changes
    * Mention all the members of my team
        * Ask for feedback

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

------

# Task lists

- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [ ] this is a complete item
- [ ] this is an incomplete item

------

# Ignoring Markdown formatting

You can tell GitHub to ignore (or escape) Markdown formatting by using \ before the Markdown character.

Let's rename \*our-new-project\* to \*our-old-project\*.

------

# Links

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

------

# Images

Here's our logo (hover to see the title text):

Inline-style:
![alt text](https://tedt.org/img/TT.svg "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://tedt.org/img/TT.svg "Logo Title Text 2"

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

------

# [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

------

# Code and Syntax Highlighting

Inline `code` has `back-ticks around` it.

```c#
using System.IO.Compression;

#pragma warning disable 414, 3021

namespace MyApplication
{
    [Obsolete("...")]
    class Program : IInterface
    {
        public static List<int> JustDoIt(int count)
        {
            Console.WriteLine($"Hello {Name}!");
            return new List<int>(new int[] { 1, 2, 3 })
        }
    }
}
```

```css
@font-face {
  font-family: Chunkfive; src: url('Chunkfive.otf');
}

body, .usertext {
  color: #F0F0F0; background: #600;
  font-family: Chunkfive, sans;
}

@import url(print.css);
@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```

```javascript
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}

export  $initHighlight;
```

```php
require_once 'Zend/Uri/Http.php';

namespace Location\Web;

interface Factory
{
    static function _factory();
}

abstract class URI extends BaseURI implements Factory
{
    abstract function test();

    public static $st1 = 1;
    const ME = "Yo";
    var $list = NULL;
    private $var;

    /**
     * Returns a URI
     *
     * @return URI
     */
    static public function _factory($stats = array(), $uri = 'http')
    {
        echo __METHOD__;
        $uri = explode(':', $uri, 0b10);
        $schemeSpecific = isset($uri[1]) ? $uri[1] : '';
        $desc = 'Multi
line description';

        // Security check
        if (!ctype_alnum($scheme)) {
            throw new Zend_Uri_Exception('Illegal scheme');
        }

        $this->var = 0 - self::$st;
        $this->list = list(Array("1"=> 2, 2=>self::ME, 3 => \Location\Web\URI::class));

        return [
            'uri'   => $uri,
            'value' => null,
        ];
    }
}

echo URI::ME . URI::$st1;

__halt_compiler () ; datahere
datahere
datahere */
datahere
```

------

# Tables

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
{: .table-responsive-sm}

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

| Command | Description |
| --- | --- |
| git status | List all new or modified files |
| git diff | Show file differences that haven't been staged |

| Command | Description |
| --- | --- |
| `git status` | List all *new or modified* files |
| `git diff` | Show file differences that **haven't been** staged |

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |

| Name     | Character |
| ---      | ---       |
| Backtick | `         |
| Pipe     | \|        |

------

# Blockquotes

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.

------

# Inline HTML

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>

------

# Horizontal Rules

Three or more...

---

Hyphens

***

Asterisks

___

Underscores

------

# YouTube Videos

<a href="https://www.youtube.com/watch?feature=player_embedded&v=lTf7CLF1Xbg" target="_blank">
<img src="https://img.youtube.com/vi/lTf7CLF1Xbg/0.jpg" alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10">
</a>

[![IMAGE ALT TEXT HERE](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/320px-YouTube_Logo_2017.svg.png)](https://www.youtube.com/watch?v=lTf7CLF1Xbg)





## Basic Typography

Paragraphs are ++separated++ by a blank line.

2nd paragraph. _Italic_, **bold**, `monospace`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 3-columns in.

## Headings

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

### Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


### Subscript & Superscript

Supported via the `markdown-it-sub` and `markdown-it-sup` plugins.

- H~2~O
- 19^th^

### Inserted / Underlined Text

Supported via the `markdown-it-ins` plugin.

++Inserted text++

### Marked Text

Supported via the `markdown-it-mark` plugin.

==Marked text==

### Footnotes

Supported via the `markdown-it-footnote` plugin.

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote text **can have markup**

    and multiple paragraphs.

[^second]: Footnote 2 text (with duplicated reference).

### Blockquotes

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.
>
> > They can be nested as well
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.

### Typographic replacements

With the markdown-it parser, the typographer option allows you to auto-format commonly used symbols. For example:

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

ellip.. ellipsis... (ellipsis extra)..... (ellipsis query)?..... (ellipsis exclamation)!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'.

Other smartypants configurations:

 - Use 3 dashes `---` for an em-dash. (e.g. Note --- Its a cool day)
 - Use 2 dashes `--` for an en-dash or ranges (e.g. "It's all in chapters 12--14").
 - Three dots `...` will be converted to an ellipsis. (e.g. He goes on and on ...)
 - Straight quotes ( `"` and `'` ) will be converted to "curly double" and 'curly single'


## Horizontal Rules

___

---

***
  
## Lists

### Unordered List

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!
    
### Ordered List

Here is a numbered list:

1. first item
2. second item
3. third item

Note again how the actual text starts at 3 columns in (3 characters
from the left side).

1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar

### Nested List

Now a nested list:

1. First, get these ingredients:
   - carrots
   - celery
   - lentils

2. Boil some water.

3. Dump everything in the pot and follow
   this algorithm:
   - find wooden spoon
   - manage pot
      - uncover pot
      - stir
      - cover pot
      - balance wooden spoon precariously on pot handle
   - wait 10 minutes
   - goto first step (or shut off burner when done)

* Do not bump wooden spoon or it will fall.

Notice again how text always lines up on at 3-space indents (including
that last line which continues item 3 above).

### Definition Lists

Apple
   : Pomaceous fruit of plants of the genus Malus in
   the family Rosaceae.

Orange
   : The fruit of an evergreen tree of the genus Citrus.

Tomatoes
   : There's no "e" in tomato.

You can put blank lines in between each of the above definition list lines to spread things
out more. Also you can lazy continue lists, add inline markup, and also include paragraphs
within each definition.

Apple

:   Pomaceous fruit of plants of the genus Malus in
the family Rosaceae (note the lazy continuation).

Orange

:   The fruit of an evergreen tree of the **genus Citrus** (note the inline markup).

Tomatoes

: There's no "e" in tomato.

    { some code, part of Definition 'Tomatoes' }

    Third paragraph of definition 'Tomatoes'.

Here is an example of a _compact definition list style_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b

## Code

This is an `inline code`.

Here's an indented code block sample:

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~

(which makes copying & pasting easier). You can optionally mark the
delimited block for syntax highlighting with any code pretty CSS framework.  

PYTHON CODE EXAMPLE:

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
~~~

JAVASCRIPT EXAMPLE

``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

PHP CODE EXAMPLE:

~~~php
namespace site\controllers;

use yii\web\Controller;

class BaseController extends Controller {
    const HAPPY = 1;
    const SAD = 2;

    public function actionGood($param) {
        if ($param === self::HAPPY) {
            echo 'I am happy.';
        } else {
            echo 'I am sad.';
        }
    }
}
~~~

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)

Here's a link to [a website](http://foo.bar). Here's a link to a [local
doc](local-doc.html). Here's a footnote [^1].

[^1]: Footnote link text goes here.

## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

## Tables

Tables can look like this:

size | material     | color
---- | ------------ | ------------
9    | leather      | brown
10   | hemp canvas  | natural
11   | glass        | transparent

You can specify alignment for each column by adding colons to separator lines. 
A colon at the left of the separator line will make the column left-aligned; a 
colon on the right of the line will make the column right-aligned; colons at both 
side means the column is center-aligned.

| Item      | Description | Value|
|:--------- |:-----------:|-----:|
| Computer  | Desktop PC  |$1600 |
| Phone     | iPhone 5s   |  $12 |
| Pipe      | Steel Pipe  |   $1 |

You can apply span-level formatting to the content of each cell using regular Markdown syntax:

| Function name | Description                    |
| ------------- | ------------------------------ |
| `help()`      | Display the help window.       |
| `destroy()`   | **Destroy your computer!**     |

## Other

### Abbreviations

Supported via the `markdown-it-abbr` plugin. Create an abbreviation definition like this:

~~~
*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
~~~

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium

then, elsewhere in the document, write text such as:

The HTML specification is maintained by the W3C.

, and watch how the instance of those words in the text are highlighted.

Note that it converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

### Emojies

Note that emojies need to be supported by the markdown parser. This is enabled in this package
via the `markdown-it-emoji` plugin.

> Classic markup: :wink: :smile: :cry: :laughing: :yum: :boy: :girl:
>
> Shortcuts (emoticons): :-) o:) :,( 8-) ;) ,:(

When using the default parser (markdown-it), you can set **useTwemoji** to **true** to change output using
[Twitter Emojis](https://github.com/twitter/twemoji).
You can also [check how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output)
with twemoji.

### Smart Arrows

Supported via the `markdown-it-smartarrows` plugin. You can add "smart arrows" to markdown-it's typographic
enhancements:

|Code      |  Output  |
|:--------:|:--------:|
| `-->`    | -->      |
| `<--`    | <--      |
| `<-->`   | <-->     |
| `<==`    | <==      |
| `==>`    | ==>      |
| `<==>`   | <==>     |

### Checkboxes

Supported via the `markdown-it-checkbox` plugin. This allows to create checkboxes for tasklists as shown below.

- [x] Activity One
- [x] Activity Two
- [x] Activity Three
- [ ] Activity Four
- [ ] Activity Five
- [ ] Activity Six

---

##### Done.
