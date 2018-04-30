# Funnelback exclude regex creator

This script allows easy creation of a regex for Funnelback's exclude function.

From a terminal run the following:

```
node index -i input.txt -o output.txt
```

This will use _input.txt_ as its input and write to _output.txt_. These are the default filenames, so the above command is the same as running `node index`.

The script essentially replaces newlines with *|* and escapes *?*, */*, *.*, *\** and *$*.

The only complexity is escaping submatches. The script looks for the string `new RegExp("...")` and removes it whilst replacing other characters before adding them in at the end.

## Adding new items to the exclude file

Simply add a new line with the new URL on. If you need a regex as part of the URL, use the form `new RegExp("...")`.

## TODO

* Add unit tests to ensure certain strings are escaped properly
* Make it easier to use for users who don't use the terminal
