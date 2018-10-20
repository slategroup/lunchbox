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

    $('canvas').remove();
    //processText();

    // makes downloaded image 2x
    var w = $('.social-graphic-quote').css('width').replace('px', '');
    var h = $('.social-graphic-quote').css('height').replace('px', '');
    var quoteDownload = document.querySelector('.social-graphic-quote');
    var testcanvas = document.createElement('canvas');
    testcanvas.width = w*2;
    testcanvas.height = h*2;
    testcanvas.style.width = w + 'px';
    testcanvas.style.height = h + 'px';
    var context = testcanvas.getContext('2d');
    context.scale(2,2);

    // new function trying to increase the size of the downloaded image
    html2canvas(quoteDownload, { canvas: testcanvas }).then(function(canvas) {
        document.body.appendChild(canvas);

        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var filename = processFilename(); 

        var a = $("<a>").attr("href", strDataURI).attr("download", "quote-" + filename + ".png").appendTo("body");

        a[0].click();

        a.remove();

        $('#download').attr('href', strDataURI).attr('target', '_blank');
        $('#download').trigger('click');
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
    });

    // make certain elements white if background calls for it
    $('.filters select').on('change', function() {
        // is there a way to not rewrite these...???
        var $brandSelected = $('.filter_change-brand option:selected'); 
        var $brandSelectedID = $brandSelected.attr('id');
        var $brandSelectedValue = $brandSelected.attr('value');
        var $colorSelected = $('.filter_change-color option:selected');
        var $colorSelectedID = $colorSelected.attr('id');
        var $styleSelected = $('.filter_change-style option:selected');
        var $styleSelectedID = $styleSelected.attr('id');

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
            $('.filter_change-color #plum').attr('disabled','disabled');
        }

        // adds podcast name if podcast brand is selected
        if (!$brandSelected.hasClass('slate-brand')) {
            $podcastName.html($brandSelectedValue); 
        } else {
            $podcastName.html(''); 
        }

        // change background color + class
        // change brand class
        $poster.removeClass('slow-burn trumpcast')
                    .addClass($brandSelectedID);
        $poster.removeClass('poster-white poster-raisin poster-plum poster-brand-color')
                    .addClass('poster-' + $colorSelectedID);

        // changes slate logo
        if (($brandSelected.hasClass('slate-brand')) && (($colorSelectedID === 'raisin') || ($colorSelectedID === 'plum'))) {
            $brandLogo.attr('src','img/brand/' + $brandSelectedID + '-white.png' );
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
                $('blockquote').removeClass();
                $('blockquote').addClass('js_quotes');

                $('blockquote img').show();
                $('blockquote .img1').attr('src', 'img/quote_start_white.png'); 
                $('blockquote .img2').attr('src', 'img/quote_end_white.png');
            } else if ($styleSelectedID === 'brackets') {
                $('blockquote').removeClass();
                $('blockquote').addClass('js_brackets');

                $('blockquote img').show();
                $('blockquote .img1').attr('src', 'img/bracket_start_white.png'); 
                $('blockquote .img2').attr('src', 'img/bracket_end_white.png');
            } else {
                $('blockquote img').hide();
            }

        } else if ($styleSelectedID === 'brackets') {

            $('blockquote').removeClass();
            $('blockquote').addClass('js_brackets'); 

            $('blockquote img').show();
            $('blockquote .img1').attr('src', 'img/bracket_start.png'); 
            $('blockquote .img2').attr('src', 'img/bracket_end.png');

        } else if ($styleSelectedID === 'none') {

            $('blockquote').removeClass();
            $('blockquote img').hide();

        } else {

            $('blockquote').removeClass();
            $('blockquote').addClass('js_quotes');

            $('blockquote img').show();
            $('blockquote .img1').attr('src', 'img/quote_start.png'); 
            $('blockquote .img2').attr('src', 'img/quote_end.png');

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


    var quoteEl = document.querySelectorAll('.social-graphic-quote blockquote');
    var sourceEl = document.querySelectorAll('.source');
    var podcastNameEl = document.querySelectorAll('.podcast-name');

    var quoteEditor = new MediumEditor(quoteEl, {
        disableToolbar: true,
        placeholder: 'Type your quote here'
    });

    var sourceEditor = new MediumEditor(sourceEl, {
        disableToolbar: true,
        placeholder: '  '
    });

    var podcastNameEditor = new MediumEditor(podcastNameEl, {
        disableToolbar: true,
        placeholder: ''
    });
});
