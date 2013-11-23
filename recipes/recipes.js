{

  "toysrus":{
    // start at the root
    "root":"http://www.toysrus.com/sitemap/map.jsp",

    // then apply the next step
    "next":{

      // collect additional pages like the current one
      "collect":".pagination a",

      // select the links across (this+collect) pages
      "select":"#sitemapLinks a",

      // then apply the next step
      "next":{

        // collect additional pages like the current one
        "collect":"#pagination .results",

        // select the links across (this+collect) pages
        "select":".fLeft a",

        // then apply the next step
        "next":{
          "stash":"datastore-key-goes-here"
        }
      }
    }
  }

  ,

  "newegg":{
    // start at the root
    "root":"http://www.newegg.com/Info/SiteMap.aspx",

    // then apply the next step
    "next":{

      // select the links on this page
      "select":".siteMapLeft ul > li > a",

      // NOTE: no siblings

      // then apply the next step
      "next":{

        // collect additional pages like the current one
        "collect":".pagination ul > li > a",

        // select all the product links across (this+collect) pages
        "select":".itemCell > .itemText > .wrapper > a"

        // then apply the next step
        "next":{
          // we're now looking at all of the products
          "stash":"datatsore-key-goes-here"
        }
      }
    }
  }

  ,

  "tigerdirect":{
    "root":"http://www.tigerdirect.com/sectors/category/site-directory.asp",

    "next":{
      "select":".mastNav-cat a",

      "next":{
        "collect":[
          "#tlcCallout dd > a",
          "#filterForm span"
        ],
        "select":"h2+ .innerWrap a",
        "recurse-until-found":".itemsPagination",

        "next":{
          "collect":".itemsPagination:first td > a"
          "select":".itemName a",

          "next":{
            "stash":"datatsore-key-goes-here"
          }
        }
      },
    }
  }

}
