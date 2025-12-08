module.exports = [
"[externals]/html2pdf.js [external] (html2pdf.js, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_html2pdf_2e255252.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/html2pdf.js [external] (html2pdf.js, cjs)");
    });
});
}),
];