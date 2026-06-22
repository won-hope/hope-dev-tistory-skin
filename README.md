# HOPEDEV Technical Blog Theme V1 & V2 Static Prototype

This repository contains the static prototype of the **HOPEDEV** blog theme, optimized for deep software engineering posts, clear categorization, and dark/light modes.

## V2 Features Added
- **Dachshund Loading Animation**: SVG animation loader displayed once per session.
- **Blog Snapshot Dashboard**: Visualizes statistics (Total Visitors, Total Posts, Building Since, Engineering Circle) with number count-up animation.
- **Popular Categories**: Replaces explore topics with a dense information layout, including counts and progress bars.
- **Engineering Circle**: Section for recommended reading/blogs.
- **Enhanced Sidebar**: Dynamic category post count badges.
- **V2 Documentation**: See `V2_NOTES.md` for integration guidelines.

## Folder Structure

```
.
├── preview/
│   ├── index.html        # Home & landing page showing hero, featured insight, explore topics, latest notes
│   └── article.html      # Long-form article page showing title bar, breadcrumb, TOC, codes, tables, and notes
├── assets/
│   ├── css/
│   │   └── style.css     # Pure CSS stylesheet with design tokens, layout grids, and visual animations
│   ├── js/
│   │   └── app.js        # Custom Vanilla JavaScript (defer) implementing theme switcher, mobile drawers, dynamic TOC, lightbox, and scrolls
│   └── images/
│       ├── avatar.svg    # Modern visual SVG representation for bio avatar
│       └── placeholder-cover.svg  # Minimalist vector placeholder for article hero/visuals
├── COPYRIGHT.md          # Rights reserved notice
├── README.md             # Project documentation (this file)
└── .gitignore            # Git exclusions
```

## Local Preview

To inspect and test this static prototype, you need to spin up a basic static file server.

### Option 1: Python (Built-in)
Run the following command from the repository root:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000/preview/index.html` or `http://localhost:8000/preview/article.html`.

### Option 2: Node.js (npx)
If you have Node.js installed, run:
```bash
npx serve .
```
Then visit the given URL (typically `http://localhost:3000` or `http://localhost:5000`).

### Option 3: VS Code Extension
Use the **Live Server** extension by right-clicking on `preview/index.html` and choosing **"Open with Live Server"**.

## Future Tistory Migration
This structure has been created to easily split assets for production Tistory integration:
- `preview/index.html` and `preview/article.html` will be merged and refactored into `skin.html` using Tistory variables.
- `assets/css/style.css` maps directly to Tistory's `style.css`.
- `assets/js/app.js` and graphics inside `assets/images/` will be uploaded to Tistory image servers or referenced via the HTML structure.
