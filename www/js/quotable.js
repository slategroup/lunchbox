var $text = null;
var $save = null;
var $poster = null;
var $themeButtons = null;
var $aspectRatioButtons = null;
var $quote = null;
var $fontSize = null;
var $show = null;
var $source = null;
var $quote = null;
var $logoWrapper = null;

var quotes = [
    {
        "quote": "I'd been drinking.",
        "source": "Dennis Rodman", 
        "size": 30
    },
    {
        "quote": "I've made a huge mistake.",
        "source": "G.O.B.", 
        "size": 30
    },
    {
        "quote": "Yes, I have smoked crack cocaine",
        "source": "Toronto Mayor Rob Ford",
        "size": 20
    },
    {
        "quote": "Annyong.",
        "source": "Annyong",
        "size": 30
    },
    {
        "quote": "STEVE HOLT!",
        "source": "Steve Holt",
        "size": 30
    },
    {
        "quote": "Whoa, whoa, whoa. There's still plenty of meat on that bone. Now you take this home, throw it in a pot, add some broth, a potato. Baby, you've got a stew going.",
        "source": "Carl Weathers",
        "size": 20
    }
];


// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  a = a.replace(/ \u2014 /g, "\u2009\u2014\u2009");         // full spaces wrapping em dash
  return a;
}

function convertToSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

function processText() {
    $text = $('.poster blockquote p, .source');
    $text.each(function() {
        var rawText = $.trim($(this).html());
        $(this).html(smarten(rawText)).find('br').remove();
    });
}

function saveImage() {
    // first check if the quote actually fits
    if (($source.offset().top + $source.height()) > $logoWrapper.offset().top) {
        alert("Your quote doesn't quite fit. Shorten the text or choose a smaller font-size.");
        return;
    }

    // don't print placeholder text if source is empty
    if ($source.text() === '') {
        alert("A source is required.");
        return;
    }

    // make sure source begins with em dash
    if (!$source.text().match(/^[\u2014]/g)) {
        $source.html('&mdash;&thinsp;' + $source.text());
    }

    $('canvas').remove();
    processText();

    html2canvas($poster, {
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var quote = $('blockquote').text().split(' ', 5);
        var filename = convertToSlug(quote.join(' '));

        var a = $("<a>").attr("href", strDataURI).attr("download", "quote-" + filename + ".png").appendTo("body");

        a[0].click();

        a.remove();

        $('#download').attr('href', strDataURI).attr('target', '_blank');
        $('#download').trigger('click');
      }
    });
}

function adjustFontSize(size) {
    var fontSize = size.toString() + 'px';
    $poster.css('font-size', fontSize);
    if ($fontSize.val() !== size){
        $fontSize.val(size);
    };
}

$(function() {
    $text = $('.social-graphic-quote blockquote p, .source');
    $save = $('#save');
    $poster = $('.social-graphic-quote');
    $themeButtons = $('#theme .btn');
    $aspectRatioButtons = $('#aspect-ratio .btn');
    $fontSize = $('#fontsize');
    $show = $('#show');
    $source = $('.source');
    $showCredit = $('.show-credit');
    $quote = $('#quote');
    $logoWrapper = $('.logo-wrapper');

    $brandSelect = $('select.filter_change-brand'); 
    $brandLogo = $('.logo-wrapper img'); 
    $colorSelect = $('select.filter_change-color'); 

    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    if (quote.size){
        adjustFontSize(quote.size);
    }
    $('blockquote p').text(quote.quote);
    $source.html('&mdash;&thinsp;' + quote.source);
    processText();

    $save.on('click', saveImage);



    // change brand logo
    $brandSelect.on('change', function() { 

        var $brandSelected = $('.filter_change-brand option:selected'); 
        var brandSelectedID = $brandSelected.attr('id');

        // image file matches ID on select option
        $brandLogo.attr('src','../img/brand/' + brandSelectedID + '.png' );

        // disabled bg color options based on brand selection
        if (brandSelectedID === 'slate') {
            console.log('slate'); 
            $('.filter_change-color option').removeAttr('disabled'); 
            $('.filter_change-color #brand-color').attr('disabled','disabled'); 
        } else {
            console.log('not slate'); 
            $('.filter_change-color option').removeAttr('disabled'); 
            $('.filter_change-color #raisin, .filter_change-color #plum').attr('disabled','disabled');
        }
    });

    // change background color
    $colorSelect.on('change', function() {

        var $colorSelected = $('.filter_change-color option:selected'); 

        $poster.removeClass('poster-white poster-raisin poster-plum poster-brand-color')
                    .addClass('poster-' + $colorSelected.attr('id'));
    });



    $aspectRatioButtons.on('click', function() {
        $aspectRatioButtons.removeClass().addClass('btn btn-primary');
        $(this).addClass('active');
        $poster.removeClass('facebook twitter square').addClass($(this).attr('id'));

        if ($poster.hasClass('twitter')) {
            adjustFontSize(32);
            $fontSize.val(32);
        } else {
            adjustFontSize(90);
            $fontSize.val(90);
        }
    });

    $quote.on('click', function() {
        $(this).find('button').toggleClass('active');
        $poster.toggleClass('quote');
    });

    $fontSize.on('change', function() {
        adjustFontSize($(this).val());
    });

    $show.on('keyup', function() {
        var inputText = $(this).val();
        $showCredit.text(inputText);
    });

    // // This event is interfering with the medium editor in some browsers
    // $('blockquote').on('keyup', function(){

    //     console.log($(this)[0].selectionStart);
    //     process_text();
    // });


    var quoteEl = document.querySelectorAll('.poster blockquote');
    var sourceEl = document.querySelectorAll('.source');

    var quoteEditor = new MediumEditor(quoteEl, {
        disableToolbar: true,
        placeholder: 'Type your quote here'
    });

    var sourceEditor = new MediumEditor(sourceEl, {
        disableToolbar: true,
        placeholder: 'Type your quote source here'
    });
});
