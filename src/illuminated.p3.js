/*
Copyright 2020 - Ivo Pires <ivoopc@gmail.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function () {

    const root = this;

    // main class
    class IlluminatedJS extends Phaser.Plugins.ScenePlugin {

        constructor (scene, pluginManager) {
            super(scene, pluginManager);

            this.illuminatedSprites = [];
            this.opaqueObjects = [];

            this.scene = scene;

            this.occlusionCulling = true;
            
            this.fetchCachedImage();
        }

        fetchCachedImage () {
            const lampsEdge = [];
            lampsEdge[0] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjAtMDItMTRUMTY6MTY6MTctMDI6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMC0wMi0xNlQyMTo0NTozNC0wMzowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjAtMDItMTZUMjE6NDU6MzQtMDM6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6YzA0ZjAxYzAtMDAyNS0xNDRlLTkyZTYtYmExYTBlMzZkNzM4PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6Y2VkMWU3MzUtNTExZS0xMWVhLWI3MjQtY2E5ZjhkYmViYmFjPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NWJlYjc1M2MtYjlkMi05MjQxLWIwZjItNGVmZDk2ZDA4ODY4PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjViZWI3NTNjLWI5ZDItOTI0MS1iMGYyLTRlZmQ5NmQwODg2ODwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMC0wMi0xNFQxNjoxNjoxNy0wMjowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjMDRmMDFjMC0wMDI1LTE0NGUtOTJlNi1iYTFhMGUzNmQ3Mzg8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMDItMTZUMjE6NDU6MzQtMDM6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjAwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjIwMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+3OyRnAAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAUggAARVYAAA6lwAAF2/XWh+QAAAM6UlEQVR42uydX28U1xnGn5ldg21MidQooumXoWCQmqrfwcWYqLnp10hIetdvQCltvkBFw3XlkKqR2uau4goBoUCIAXu9u7PTiz2Dx+tZ7+zuec6fmecnrZAIsXfO+z7n/TPnTwLB4jGA9wGkABLzmUXxb/Ia/zY3nxGAFwB+piG3T6IhWJo9AOsVInA9tnmFeA4AnJeJhCuuAxgAyMzMPSo5Y6if4ntm5rtvy4yKIDbpAVgpjVXsY5aX/hwAWJWJp5NqCCqjxLA0856ds46IYVJMzDOdLT3nUNFFTOOymU1jSZvY6dgAwBW5hVKs/VKKoXSzOhXrmSaEUqwWplBrDUqdWKnYWikFu65haS67OOo+5fosnIJlZiyVYjWEt2YWVBplP/06AHBOKVac/Kg0yln6tSeBxMMjY7TzEoYzoWyYMX8sgYTLpyY//lDC8CaUi8YGd1SDhMUQRy/zRBg1yghAVxHE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";
            
            const img = new Image();
            img.src = lampsEdge[0];
            img.addEventListener("load", () => {
                this.scene.textures.addImage("p_illuminated-lamp-edge-0", img);
            });
        }

        boot () {
            const eventEmitter = this.systems.events;
            eventEmitter.on("postupdate", this.postUpdate, this);
            //eventEmitter.on("shutdown", this.shutdown, this);
            //eventEmitter.on("destroy", this.destroy, this);

        }

        postUpdate () {
            if (this.occlusionCulling) {
                // occlusion culling, only will render if the lamp sprite is in the main camera view
                const worldView = this.scene.cameras.main.worldView;
                for (let i = 0; i < this.illuminatedSprites.length; i ++) {

                    let lamp = this.illuminatedSprites[i];

                    if (lamp.x >= worldView.x && lamp.x <= worldView.x + worldView.width &&
                        lamp.y >= worldView.y && lamp.y <= worldView.y + worldView.height) {
                        this.illuminatedSprites[i].refresh();
                    };
                };
            } else {
                // will render all the lamps
                for (let i = 0; i < this.illuminatedSprites.length; i ++)
                    this.illuminatedSprites[i].refresh();
            };
        }

        // add lamp
        createLamp (x, y, config) {
            return this.scene.add.existing(new pLampSprite(
                this.scene,
                x,
                y,
                config,
                this
            ));
        }

        // dark mask layer
        createDarkMask (lamps, maskSize, color) {

            lamps = lamps || this.illuminatedSprites;
            
            const uniqueTexture = Date.now() + Math.random();

            // layer mask texture
            const texture = this.scene.textures.createCanvas(
                "illuminated-darkmask" + uniqueTexture,
                maskSize.width,
                maskSize.height
            );
            texture.context.fillStyle = color;
            texture.context.fillRect(0, 0, maskSize.width, maskSize.height);
            texture.refresh();
            const layerMask = this.scene.add.sprite(0, 0, texture)
                .setOrigin(0, 0);

            // layer mask and elements
            const 
                shape = this.scene.make.graphics(),
                lampsEdge = [];

            for (let i = 0; i < lamps.length; i ++) {

                // adding the sprite that will crop the layerMask in lamps sprites
                shape.fillCircleShape({
                    x: lamps[i].lamp.offset.x + (lamps[i].displayWidth / 2), 
                    y: lamps[i].lamp.offset.y + (lamps[i].displayHeight / 2), 
                    radius: lamps[i].lamp.distance
                });

                // --> unfortunately native phaser scene.graphics is not rendering properly <--

                // const border = this.scene.add.graphics({ lineStyle: { width: 20, color: 0x000000, alpha: 0.5 }, fillStyle: { color: 0xff0000, alpha: 0 }});
                // const circle = new Phaser.Geom.Circle(
                //     lamps[i].lamp.offset.x + (lamps[i].displayWidth / 2), 
                //     lamps[i].lamp.offset.y + (lamps[i].displayHeight / 2), 
                //     70
                // );
                // border.strokeCircleShape(circle);

                // so we use pre-maded sprite (using in-code base64 text)
                lampsEdge[i] = this.scene.add.sprite(
                    lamps[i].lamp.offset.x, 
                    lamps[i].lamp.offset.y, 
                    "p_illuminated-lamp-edge-0"
                ).setOrigin(0, 0);
                lampsEdge[i].alpha = this.treatOpacity(Number(color.replace(/^.*,(.+)\)/,"$1")));
                lampsEdge[i].displayWidth = lamps[i].displayWidth;
                lampsEdge[i].displayHeight = lamps[i].displayHeight;
            };

            shape.fillPath();

            // putting the mask on layer
            const mask = shape.createGeometryMask();
            layerMask.setMask(mask);
            // super important flag
            layerMask.mask.invertAlpha = true;

            // all the lamp edges here, if you want to handle them
            layerMask.lampsEdge = lampsEdge; 
            return layerMask;
        }

        createRectangleObject (x, y, w, h) {

            const obj = new illuminated.RectangleObject({
                topleft: new illuminated.Vec2(x, y),
                bottomright: new illuminated.Vec2(x + w, y + h)
            });

            obj.originalX = x;
            obj.originalY = y;
            obj.originalW = w;
            obj.originalH = h;

            return obj;
        }

        createDiscObject (centerX, centerY, radius) {

            const obj = new illuminated.DiscObject({
                position: new illuminated.Vec2(centerX, centerY), 
                radius
            });

            obj.originalX = centerX;
            obj.originalY = centerY;

            return obj;
        }

        treatOpacity (number) {
            return number <= 0.1 ? 0.09 : number - 0.1;
        }
    };

    // lamp sprite class
    class pLampSprite extends Phaser.GameObjects.Sprite {
        constructor (scene, x, y, config, plugin) {

            super(scene, x, y);

            x = x || 0;
            y = y || 0;

            // unique texture to lamp sprite
            const uniqueTexture = Date.now() + Math.random();

            config = config || {};
            config.distance = config.distance || 200;
            config.position = new illuminated.Vec2(config.distance, config.distance);

            const texture = scene.textures.createCanvas(
                "illuminated-lamp-" + uniqueTexture,
                config.distance * 2,
                config.distance * 2
            );

            const lamp = new illuminated.Lamp(config);
            lamp.offset = {};
            this.setTexture(texture);
            this.textureIndex = "illuminated-lamp-" + uniqueTexture;
            this.texture = texture;
            this.lamp = lamp;
            this.setOrigin(0, 0);
            this.refresh();

            plugin.illuminatedSprites.push(this);
        }

        refresh () {

            // super important, without it sprite will not render
            this.texture.refresh();
            this.texture.context.clearRect(0, 0, this.texture.width, this.texture.height);

            if(this.lighting) {
                //render solid objects relative to position of sprites
                this.lighting.objects.forEach(o => {
                    if(o.topleft && o.bottomright){ //rect obj
                        o.topleft.x = o.originalX - this.x + this.lamp.distance;
                        o.topleft.y = o.originalY - this.y + this.lamp.distance;
                        o.bottomright.x = o.originalX + o.originalW - this.x + this.lamp.distance;
                        o.bottomright.y = o.originalY + o.originalH - this.y + this.lamp.distance;
                        o.syncFromTopleftBottomright();
                    }else if(o.radius){ //disc obj
                        o.center.x = o.originalX - this.x + this.lamp.distance;
                        o.center.y = o.originalY - this.y + this.lamp.distance;
                    }else if(o.a && o.b){ //line obj
                        o.a.x = o.originalStartX - this.x + this.lamp.distance;
                        o.a.y = o.originalStartY - this.y + this.lamp.distance;
                        o.b.x = o.originalEndX - this.x + this.lamp.distance;
                        o.b.y = o.originalEndY - this.y + this.lamp.distance;
                    }else if(o.points){ //polygon
                        o.points.forEach(function(point, index){
                            point.x = o.originalData[index].x - this.x + this.lamp.distance;
                            point.y = o.originalData[index].y - this.y + this.lamp.distance;
                        }, this);
                    }
                });

                this.lighting.compute(this.texture.width, this.texture.height);
                this.lighting.render(this.texture.context);
            }else {
                this.lamp.render(this.texture.context);
            };

            //this.texture.dirty = true;
            this.lamp.offset.x = this.x;
            this.lamp.offset.y = this.y;
        }

        createLighting (opaqueObjects) {
            if(!opaqueObjects){
                return null;
            };

            var lighting = new illuminated.Lighting({light: this.lamp, objects: opaqueObjects});
            lighting.compute(this.texture.width, this.texture.height);
            lighting.render(this.texture.context);

            this.lighting = lighting;

            return this;
        }

        getLamp () {
            return this.lamp;
        }
    };

    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = IlluminatedJS;
        };
        exports.IlluminatedJS = IlluminatedJS;
    } else if (typeof define !== "undefined" && define.amd) {
        define("IlluminatedJS", (function() { return root.IlluminatedJS = IlluminatedJS; })() );
    } else {
        root.IlluminatedJS = IlluminatedJS;
    };

    return IlluminatedJS;
}).call(this);
