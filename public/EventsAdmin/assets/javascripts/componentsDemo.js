$(document).ready(function(){$(".easy-change-theme button").each(function(){$(this).click(function(){var t=$(this).attr("data-theme");$("body").attr("class",t)})}),$(".copy_btn").zclip({path:"swf/ZeroClipboard.swf",copy:function(){return $(this).closest(".desc-box").find("textarea").val()}})});