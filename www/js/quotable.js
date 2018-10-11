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
var $podcastName = null; 

var quotes = [
    {
        "quote": "The quick brown fox jumps over the lazy dog.",
        "source": "Some Person", 
        "size": 40
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

/*function processText() {
    $text = $('.social-graphic-quote p, .source, .podcast-name');
    $text.each(function() {
        var rawText = $.trim($(this).html());

        $(this).html(smarten(rawText)).find('br').remove();
    });
}*/

function processFilename() {
    $text = $('.social-graphic-quote blockquote p');
    var rawText = $.trim(($text).html().replace('.', ''));
    var filename = rawText.replace(/ +/g, '-').toLowerCase();

    return filename; 
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
    /*if (!$source.text().match(/^[\u2014]/g)) {
        $source.html('&mdash;&thinsp;' + $source.text());
    }*/

    $('canvas').remove();
    //processText();

    html2canvas($poster, {
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var quote = $('blockquote').text().split(' ', 5); 
        var filename = processFilename(); 

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
    $text = $('.social-graphic-quote blockquote p');
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
    $podcastName = $('.podcast-name'); 

    $brandSelect = $('select.filter_change-brand'); 
    $brandLogo = $('.logo-wrapper img'); 
    $colorSelect = $('select.filter_change-color'); 
    $styleSelect = $('select.filter_change-style'); 

    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    if (quote.size){
        adjustFontSize(quote.size);
    }
    $('blockquote p').text(quote.quote);
    $source.html(quote.source);
    $podcastName.html(quote.podcastName);
    //processText();

    // nan's custom function that is very similar to others
    processFilename(); 

    $save.on('click', saveImage);

    // change graphic crop
    $aspectRatioButtons.on('click', function() {
        $aspectRatioButtons.removeClass().addClass('btn btn-primary');
        $(this).addClass('active');
        $poster.removeClass('facebook twitter square').addClass($(this).attr('id'));

        /*if ($poster.hasClass('twitter')) {
            adjustFontSize(32);
            $fontSize.val(32);
        } else {
            adjustFontSize(90);
            $fontSize.val(90);
        }*/
    });

    // change brand logo
    $brandSelect.on('change', function() { 

        var $brandSelected = $('.filter_change-brand option:selected'); 
        var $brandSelectedID = $brandSelected.attr('id');
        var $brandSelectedValue = $brandSelected.attr('value');

        // image file matches ID on select option
        $brandLogo.attr('src','img/brand/' + $brandSelectedID + '.png' );

        // disabled bg color options based on brand selection
        if ($brandSelectedID === 'slate') {
            console.log('slate'); 
            $('.filter_change-color option').removeAttr('disabled'); 
            $('.filter_change-color #brand-color').attr('disabled','disabled'); 
        } else {
            console.log('not slate'); 
            $('.filter_change-color option').removeAttr('disabled'); 
            $('.filter_change-color #raisin, .filter_change-color #plum').attr('disabled','disabled');
        }

        // adds podcast name if podcast brand is selected
        if ($brandSelectedID != 'slate') {
            $podcastName.html($brandSelectedValue); 
        } else {
            $podcastName.html(''); 
        }

        $poster.removeClass('slow-burn trumpcast')
                    .addClass($brandSelected.attr('id'));
    });

    // change background color
    $colorSelect.on('change', function() {

        var $colorSelected = $('.filter_change-color option:selected'); 

        $poster.removeClass('poster-white poster-raisin poster-plum poster-brand-color')
                    .addClass('poster-' + $colorSelected.attr('id'));

    });

    // make certain elements white if background calls for it
    $('.filters select').on('change', function() {
        // is there a way to not rewrite these...???
        var $brandSelected = $('.filter_change-brand option:selected'); 
        var $brandSelectedID = $brandSelected.attr('id');
        var $colorSelected = $('.filter_change-color option:selected');
        var $colorSelectedID = $colorSelected.attr('id');
        var $styleSelected = $('.filter_change-style option:selected');
        var $styleSelectedID = $styleSelected.attr('id');

        // changes slate logo
        if (($brandSelectedID === 'slate') && (($colorSelectedID === 'raisin') || ($colorSelectedID === 'plum'))) {
            $brandLogo.attr('src','img/brand/' + $brandSelectedID + '_white.png' );
        } else {
            $brandLogo.attr('src','img/brand/' + $brandSelectedID + '.png' );
        }

        console.log($styleSelectedID); 
        // changes quote style and color
        // this is not the most elegant solution i am aware
        // 'brand-color' might need to be removed depending on the brand colors
        if (($colorSelectedID === 'raisin') || 
            ($colorSelectedID === 'plum') || 
            ($colorSelectedID === 'brand-color')) {

            if ($styleSelectedID === 'quotes') {
                $('blockquote p').removeClass();
                $('blockquote p').addClass('js_quotation-marks-white');
            } else if ($styleSelectedID === 'brackets') {
                $('blockquote p').removeClass();
                $('blockquote p').addClass('js_brackets-white');
            } else {
                $('blockquote p').removeClass();
            }

        } else if ($styleSelectedID === 'brackets') {

            $('blockquote p').removeClass();
            $('blockquote p').addClass('js_brackets');

        } else if ($styleSelectedID === 'none') {

            $('blockquote p').removeClass();

        } else {

            $('blockquote p').removeClass();
            $('blockquote p').addClass('js_quotation-marks');

        }

    }); 

    $fontSize.on('change', function() {
        adjustFontSize($(this).val());
    });

    $quote.on('click', function() {
        $(this).find('button').toggleClass('active');
        $poster.toggleClass('quote');
    });

    /*$show.on('keyup', function() {
        var inputText = $(this).val();
        $showCredit.text(inputText);
    });*/

    // // This event is interfering with the medium editor in some browsers
    // $('blockquote').on('keyup', function(){

    //     console.log($(this)[0].selectionStart);
    //     process_text();
    // });


    var quoteEl = document.querySelectorAll('.poster blockquote');
    var sourceEl = document.querySelectorAll('.source');
    var podcastNameEl = document.querySelectorAll('.podcast-name');

    var quoteEditor = new MediumEditor(quoteEl, {
        disableToolbar: true,
        placeholder: 'Type your quote here'
    });

    var sourceEditor = new MediumEditor(sourceEl, {
        disableToolbar: true,
        placeholder: 'Type your quote source here'
    });

    var podcastNameEditor = new MediumEditor(podcastNameEl, {
        disableToolbar: true,
        placeholder: ''
    });
});
