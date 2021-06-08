BEGIN{
    RS="^$";
    getline h < "header.html"; close("header.html");
    gsub("&", "\\\\&", h);
    getline f < "footer.html"; close("footer.html");
    gsub("&", "\\\\&", f);
    getline b < body_file; close(body_file);
    gsub("&", "\\\\&", b);
    RS="\n";
}

# if is not index, remove landing from body css classes
/<body class="is-preload landing">/{
    if( body_file != "index-body.html" ){gsub(" landing","")}
}

/<getargv-header \/>/{gsub($0,h)}
/<getargv-footer \/>/{gsub($0,f)}
/<getargv-main \/>/{gsub($0,b)}
1
