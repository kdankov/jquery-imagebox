/*
 * ImageBox - jQuery Plugin
 * simple and fancy lightbox alternative
 * By Konstantin Dankov (http://dankov.name)
 * Examples and documentation at: https://github.com/kdankov/imagebox
 * 
 * Version: 2.0 Beta 1
 * Requires: jQuery v1.3+
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

function ib_init(){
	
	// --------------------------------------------------------
	// Configuration area ---- Make changes here when needed
	// --------------------------------------------------------
	
		var ib_information = true;
		var ib_external_padding = 100;
		var ib_internal_padding = 5;
		var ib_animate_time = 300;
		
		// Debug information when things get bad
		var ib_debug = true; // Show information
		
	// --------------------------------------------------------
	// Configuration area ends here
	// --------------------------------------------------------
	
	// Checking for console support
	if ( typeof console == "object" ) {
		var support_for_console = true;
	}
	else
	{
		var support_for_console = false;
	}
	
	// Appending html structure to the page
	$('body').append('<div id="ib_overlay"></div>');
	$('body').append('<div id="ib_box"><div id="ib_inner"><img id="ib_image" src="" alt="" title="" /><div id="ib_info"><div id="ib_data"><h4></h4><p></p></div></div><div id="ib_close">X Close</div></div></div>');

	var ib_overlay 				= $('#ib_overlay');
	var ib_box 					= $('#ib_box');
	var ib_box_inner 			= ib_box.find('#ib_inner');
	var ib_pic 					= ib_box.find('#ib_image');
	var ib_panel_close 			= ib_box.find('#ib_close');
	var ib_info_panel 			= ib_box.find('#ib_info');
	var ib_info_panel_data 		= ib_info_panel.find('#ib_data');
	var ib_info_panel_header 	= ib_box.find('h4');
	var ib_info_panel_content	= ib_info_panel.find('p');
	
	// OnClick event - starts the thing
	$('.imagebox').click(function(){
		
		// --------------------------------------------------------
		// Do not touch the code below if you don't know what are you doing
		// --------------------------------------------------------
		
		// Get the window size. This is part of the resizing functionality it resizes bigger pictures to fit inside your window.
		var ib_pagesize = ib_getPageSize();
		var ib_pagesize_width = ib_pagesize[0];
		var ib_pagesize_height = ib_pagesize[1];
		
		// Get box padding from CSS
		var ib_padding_temp = ib_box.css("padding-top");
		var ib_numbers = new RegExp("\\d*")
		var ib_padding = ib_padding_temp.match(ib_numbers);

		// Creating the objects that will be called multiple times. Ads readability and improves performance.
		var ib_link 				= $(this);
		var ib_link_offset			= $(this).offset();
		var body_scroll				= $.browser.mozilla ? $("html").scrollTop() : $("body").scrollTop(); // For some strange reason the scrolling is handled by the HTML tag in Firefox
		var ib_link_image_width		= $(this).width() - ib_padding*2;
		var ib_link_image_height	= $(this).height() - ib_padding*2;
		

		// Hide the ImageBox window and its elements
		ib_box.hide();
		ib_pic.hide();

		// Sets the dimensions and the position of the imagebox div just on top of the link that is triggering the event.
		ib_box.css({ width: ib_link_image_width, height: ib_link_image_height, position: "absolute", top: ib_link_offset.top, left: ib_link_offset.left }); // Return the box to the center of the window to be ready for the next image.
		
		// Show the overlay div - Curtains up
		ib_overlay.show();

		// Get the closing event attached
		$( '#ib_overlay, #ib_close' ).click(function(){ 
			ib_box.fadeOut( ib_animate_time, function (){
				ib_info_panel.hide();
				ib_overlay.fadeOut( ib_animate_time );
				ib_pic.attr({ width: "50px", height: "50px" });
			});
		});
		
		// Create a new Image object and assign URI to it. Takes the href from the link and loads it as sorce for the image.
		ib_preload_image = new Image();
		ib_preload_image.src = ib_link.attr('href');

		// Checks if the link is actually an Image
		var ib_urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	    var ib_urlType = ib_preload_image.src.toLowerCase().match(ib_urlString);
		
		// Launch this when the new image is loaded.
		function ib_image_loaded()
		{
			
			// Get the new image dimensions and prepare for sime calculation
			var pwidth = ib_preload_image.width;
			var pheight = ib_preload_image.height;
			var pwidth2 = 0;
			var pheight2 = 0;
			
			if ( ib_debug && support_for_console )
			{
				console.info( "----------- Window dimension -----------" );
				console.info( "Width: " + ib_pagesize_width + "px, Height: " + ib_pagesize_height + "px" );
				console.info( "----------- Big New Image dimensions -----------" );
				console.info( "Width: " + pwidth + "px, Height: " + pheight + "px" );
			}

			// This part makes sure that if the image is bigger than your window it will be resized to fit.
			if( pwidth + ib_padding * 3 + ib_external_padding > ib_pagesize_width )
			{
				pwidth2 = ib_pagesize_width - ( ib_padding * 5 + ib_external_padding );
				pheight2 = ( pheight * pwidth2 ) / pwidth;
				pwidth = pwidth2;
				pheight = pheight2;

				if ( ib_debug && support_for_console)
				{
					console.info( "----------- Image resized -----------" );
					console.info( "--- Width: " + pwidth + "px, Height: " + pheight + "px" );
				}
			}
			else if( pheight + ib_padding * 4 + ib_external_padding > ib_pagesize_height )
			{
				pheight2 = ib_pagesize_height - ( ib_padding * 6 + ib_external_padding );
				pwidth2 = ( pwidth * pheight2 ) / pheight;
				pwidth = pwidth2;
				pheight = pheight2;

				if ( ib_debug && support_for_console )
				{
					console.info( "----------- Image resized -----------" );
					console.info( "--- Width: " + pwidth + "px, Height: " + pheight + "px" );
				}
			}
			
			// Calculate the box size
			var boxwidth = pwidth;
			var boxheight = pheight;

			var box_pos_left = (ib_pagesize_width - boxwidth) / 2;
			var box_pos_top = ((ib_pagesize_height - boxheight) / 2) + body_scroll;
			

			if ( ib_debug && support_for_console )
			{
				console.info( "----------- Box dimentions -----------" );
				console.info( "Body scrollTop: " + body_scroll + "px, Link offset.top: " + ib_link_offset.top + ", Link offset.left: " + ib_link_offset.left + "px" );
				console.info( "----------- Box dimentions -----------" );
				console.info( "Box width: " + boxwidth + "px, Box height: " + boxheight + "px" );
				console.info( "----------- Box Position -----------" );
				console.info( "Top:" + box_pos_top + ", Left: " + box_pos_left );
			}

			
			// Calculate the margins needed for positioning the box
			var margint = boxheight / 2;
			var marginl = boxwidth / 2;
			
			// Get information from the img element in the link
			var ib_pic_title = ib_link.find("img").attr("title");
			var ib_pic_alt = ib_link.find("img").attr("alt");
			
			if ( ib_debug && support_for_console )
			{
				console.info( "----------- Picture text information -----------" );
				console.info( "Pictire title: " + ib_pic_title );
				console.info( "Picture description: " + ib_pic_alt );
				console.info( "************ End of report ************ ");
			}
			
			// Set image to the right size
			ib_pic.attr({ width: pwidth, height: pheight, src: ib_preload_image.src });

			// Populate Title and Description
			ib_info_panel_header.text( ib_pic_title );
			ib_info_panel_content.html( ib_pic_alt );

			// Animation start
			ib_box
				.show()
				.animate({ width: boxwidth, height: boxheight, position: "fixed", top: box_pos_top, left: box_pos_left }, ib_animate_time, function (){
					
					ib_pic.fadeIn( ib_animate_time );
				
					$(this).hover(
						function(){	ib_info_panel.fadeIn( ib_animate_time );  },
						function(){	ib_info_panel.fadeOut( ib_animate_time ); }
					);
			});
			
		}
	    
		if(ib_urlType == '.jpg' || ib_urlType == '.jpeg' || ib_urlType == '.png' || ib_urlType == '.gif' || ib_urlType == '.bmp')
		{
			if ( ib_debug && support_for_console ){
				console.info( "************ Start of report ************ ");
				console.info( "Picture type: " + ib_urlType );
			}

			// Opera fix
			if( ib_preload_image.complete ){
				ib_image_loaded();
			}else {
				ib_preload_image.onload = function(){ 
					ib_image_loaded();
				}
			}
			
		}else {
			window.open( ib_urlString );
		}
		
		return false;
	});

}

function ib_getPageSize()
{
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight

	arrayPageSize = new Array(w,h) 

	return arrayPageSize;
}

// Start the script when the page is loaded
$(function(){ ib_init(); });