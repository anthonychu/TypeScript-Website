if (process.env.BOOTSTRAPPING) {
  const chalk = require("chalk").default
  const readline = require("readline")
  const blank = "\n".repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  // prettier-ignore
  console.log(`
  Bootstrapped. You can now run the site with ${chalk.greenBright.bold("yarn start")}.`)
  process.exit(0)
}

require("./scripts/ensureDepsAreBuilt")

const path = require.resolve("./../../watcher")
require(path)

// https://github.com/gatsbyjs/gatsby/issues/1457
require("ts-node").register({ files: true })
const { join } = require("path")

// prettier-ignore
const shiki = join(require.resolve(`gatsby-remark-shiki-twoslash`), "..", "..", "package.json")

const remarkPlugins = [
  {
    resolve: `gatsby-remark-images`,
    options: {
      maxWidth: 590,
    },
  },
  {
    resolve: `gatsby-remark-responsive-iframe`,
    options: {
      wrapperStyle: `margin-bottom: 1.0725rem`,
    },
  },
  {
    resolve: "gatsby-remark-autolink-headers",
  },
  {
    resolve: shiki,
    options: {
      // theme: "nord",
      theme: require.resolve("./lib/themes/typescript-beta-light.json"),
    },
  },
  {
    resolve: "gatsby-remark-copy-linked-files",
  },
  {
    resolve: "gatsby-remark-smartypants",
  },
]

const mdxRemarkPlugins = remarkPlugins.map(r => {
  if ("options" in r) return [require(r.resolve), r.options]
  return require(r.resolve)
})

module.exports = {
  siteMetadata: {
    siteUrl: `https://www.typescriptlang.org/`,
  },

  // This should only be used in a CI deploy while we're working in a v2 sub-folder
  pathPrefix: `/v2`,

  plugins: [
    // SCSS provides inheritance for CSS and which pays the price for the dep
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("sass"),
      },
    },
    // PWA metadata
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `TypeScript Documentation`,
        short_name: `TS Docs`,
        start_url: `/`,
        background_color: `white`,
        theme_color: `#3178C6`,
        display: `standalone`,
        icon: `static/icons/ts-logo-512.png`,
      },
    },

    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`],
        gatsbyRemarkPlugins: [],
        // gatsbyRemarkPlugins: [
        // [
        //   `gatsby-remark-shiki-twoslash`,
        //   {
        //     theme: require.resolve("./lib/themes/typescript-beta-light.json"),
        //   },
        // ],
        // ],
      },
    },

    // Support for downloading or pre-caching pages, needed for PWAs
    // "gatsby-plugin-offline",

    // Creates TS types for queries during `gatsby dev`
    {
      resolve: "gatsby-plugin-typegen",
      options: {
        // Ensure it works in a monorepo
        outputPath: __dirname + "/src/__generated__/gatsby-types.ts",
      },
    },

    // Support ts/tsx files in src
    "gatsby-plugin-typescript",
    // SEO
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // Skip handbook v2 frmo appearing in search
        exclude: [`*/2/*`],
      },
    },
    // Lets you edit the head from inside a react tree
    "gatsby-plugin-react-helmet",
    // Grabs the old handbook markdown files
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../documentation/copy`,
        name: `documentation`,
      },
    },
    // Grabs file from the tsconfig reference
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../tsconfig-reference/output`,
        name: `tsconfig-reference`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../playground-examples/generated`,
        name: `playground-examples`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../playground-examples/copy`,
        name: `all-playground-examples`,
      },
    },
    {
      resolve: "gatsby-plugin-i18n",
      options: {
        langKeyDefault: "en",
        useLangKeyLayout: true,
      },
    },

    // Markdown support, and markdown + react
    // `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: remarkPlugins,
      },
    },
    // Finds auto-generated <a>s and converts them
    // into Gatsby Links at build time, speeding up
    // linking between pages.
    {
      resolve: `gatsby-plugin-catch-links`,
      options: {
        excludePattern: /(sandbox|play|dev)/,
      },
    },
    "gatsby-plugin-client-side-redirect",
  ],
}
