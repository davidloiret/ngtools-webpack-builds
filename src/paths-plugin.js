"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const path = require("path");
const ts = require("typescript");
function resolveWithPaths(request, callback, compilerOptions, host, cache) {
    if (!request || !request.request || !compilerOptions.paths) {
        callback(null, request);
        return;
    }
    // Only work on Javascript/TypeScript issuers.
    if (!request.contextInfo.issuer || !request.contextInfo.issuer.match(/\.[jt]s$/)) {
        callback(null, request);
        return;
    }
    const originalRequest = request.request.trim();
    // Relative requests are not mapped
    if (originalRequest.startsWith('.') || originalRequest.startsWith('/')) {
        callback(null, request);
        return;
    }
    // check if any path mapping rules are relevant
    const pathMapOptions = [];
    for (const pattern in compilerOptions.paths) {
        // can only contain zero or one
        const starIndex = pattern.indexOf('*');
        if (starIndex === -1) {
            if (pattern === originalRequest) {
                pathMapOptions.push({
                    partial: '',
                    potentials: compilerOptions.paths[pattern],
                });
            }
        }
        else if (starIndex === 0 && pattern.length === 1) {
            pathMapOptions.push({
                partial: originalRequest,
                potentials: compilerOptions.paths[pattern],
            });
        }
        else if (starIndex === pattern.length - 1) {
            if (originalRequest.startsWith(pattern.slice(0, -1))) {
                pathMapOptions.push({
                    partial: originalRequest.slice(pattern.length - 1),
                    potentials: compilerOptions.paths[pattern],
                });
            }
        }
        else {
            const [prefix, suffix] = pattern.split('*');
            if (originalRequest.startsWith(prefix) && originalRequest.endsWith(suffix)) {
                pathMapOptions.push({
                    partial: originalRequest.slice(prefix.length).slice(0, -suffix.length),
                    potentials: compilerOptions.paths[pattern],
                });
            }
        }
    }
    if (pathMapOptions.length === 0) {
        callback(null, request);
        return;
    }
    if (pathMapOptions.length === 1 && pathMapOptions[0].potentials.length === 1) {
        const onlyPotential = pathMapOptions[0].potentials[0];
        let replacement;
        const starIndex = onlyPotential.indexOf('*');
        if (starIndex === -1) {
            replacement = onlyPotential;
        }
        else if (starIndex === onlyPotential.length - 1) {
            replacement = onlyPotential.slice(0, -1) + pathMapOptions[0].partial;
        }
        else {
            const [prefix, suffix] = onlyPotential.split('*');
            replacement = prefix + pathMapOptions[0].partial + suffix;
        }
        request.request = path.resolve(compilerOptions.baseUrl || '', replacement);
        callback(null, request);
        return;
    }
    const moduleResolver = ts.resolveModuleName(originalRequest, request.contextInfo.issuer, compilerOptions, host, cache);
    const moduleFilePath = moduleResolver.resolvedModule
        && moduleResolver.resolvedModule.resolvedFileName;
    // If there is no result, let webpack try to resolve
    if (!moduleFilePath) {
        callback(null, request);
        return;
    }
    // If TypeScript gives us a `.d.ts`, it is probably a node module
    if (moduleFilePath.endsWith('.d.ts')) {
        // If in a package, let webpack resolve the package
        const packageRootPath = path.join(path.dirname(moduleFilePath), 'package.json');
        if (!host.fileExists(packageRootPath)) {
            // Otherwise, if there is a file with a .js extension use that
            const jsFilePath = moduleFilePath.slice(0, -5) + '.js';
            if (host.fileExists(jsFilePath)) {
                request.request = jsFilePath;
            }
        }
        callback(null, request);
        return;
    }
    request.request = moduleFilePath;
    callback(null, request);
}
exports.resolveWithPaths = resolveWithPaths;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aHMtcGx1Z2luLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9uZ3Rvb2xzL3dlYnBhY2svc3JjL3BhdGhzLXBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFPakMsMEJBQ0UsT0FBbUMsRUFDbkMsUUFBOEMsRUFDOUMsZUFBbUMsRUFDbkMsSUFBcUIsRUFDckIsS0FBZ0M7SUFFaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0QsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4QixNQUFNLENBQUM7SUFDVCxDQUFDO0lBRUQsOENBQThDO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEIsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFL0MsbUNBQW1DO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4QixNQUFNLENBQUM7SUFDVCxDQUFDO0lBRUQsK0NBQStDO0lBQy9DLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMxQixH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QUFpRTtJQUNqRSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxtREFBbUQ7UUFDbkQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsOERBQThEO1lBQzlELE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztRQUVELFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEIsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQ2pDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQTlIRCw0Q0E4SEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge1xuICBDYWxsYmFjayxcbiAgTm9ybWFsTW9kdWxlRmFjdG9yeVJlcXVlc3QsXG59IGZyb20gJy4vd2VicGFjayc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVXaXRoUGF0aHMoXG4gIHJlcXVlc3Q6IE5vcm1hbE1vZHVsZUZhY3RvcnlSZXF1ZXN0LFxuICBjYWxsYmFjazogQ2FsbGJhY2s8Tm9ybWFsTW9kdWxlRmFjdG9yeVJlcXVlc3Q+LFxuICBjb21waWxlck9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyxcbiAgaG9zdDogdHMuQ29tcGlsZXJIb3N0LFxuICBjYWNoZT86IHRzLk1vZHVsZVJlc29sdXRpb25DYWNoZSxcbikge1xuICBpZiAoIXJlcXVlc3QgfHwgIXJlcXVlc3QucmVxdWVzdCB8fCAhY29tcGlsZXJPcHRpb25zLnBhdGhzKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgcmVxdWVzdCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBPbmx5IHdvcmsgb24gSmF2YXNjcmlwdC9UeXBlU2NyaXB0IGlzc3VlcnMuXG4gIGlmICghcmVxdWVzdC5jb250ZXh0SW5mby5pc3N1ZXIgfHwgIXJlcXVlc3QuY29udGV4dEluZm8uaXNzdWVyLm1hdGNoKC9cXC5banRdcyQvKSkge1xuICAgIGNhbGxiYWNrKG51bGwsIHJlcXVlc3QpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgb3JpZ2luYWxSZXF1ZXN0ID0gcmVxdWVzdC5yZXF1ZXN0LnRyaW0oKTtcblxuICAvLyBSZWxhdGl2ZSByZXF1ZXN0cyBhcmUgbm90IG1hcHBlZFxuICBpZiAob3JpZ2luYWxSZXF1ZXN0LnN0YXJ0c1dpdGgoJy4nKSB8fCBvcmlnaW5hbFJlcXVlc3Quc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgcmVxdWVzdCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBjaGVjayBpZiBhbnkgcGF0aCBtYXBwaW5nIHJ1bGVzIGFyZSByZWxldmFudFxuICBjb25zdCBwYXRoTWFwT3B0aW9ucyA9IFtdO1xuICBmb3IgKGNvbnN0IHBhdHRlcm4gaW4gY29tcGlsZXJPcHRpb25zLnBhdGhzKSB7XG4gICAgICAvLyBjYW4gb25seSBjb250YWluIHplcm8gb3Igb25lXG4gICAgICBjb25zdCBzdGFySW5kZXggPSBwYXR0ZXJuLmluZGV4T2YoJyonKTtcbiAgICAgIGlmIChzdGFySW5kZXggPT09IC0xKSB7XG4gICAgICAgIGlmIChwYXR0ZXJuID09PSBvcmlnaW5hbFJlcXVlc3QpIHtcbiAgICAgICAgICBwYXRoTWFwT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHBhcnRpYWw6ICcnLFxuICAgICAgICAgICAgcG90ZW50aWFsczogY29tcGlsZXJPcHRpb25zLnBhdGhzW3BhdHRlcm5dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXJJbmRleCA9PT0gMCAmJiBwYXR0ZXJuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBwYXRoTWFwT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBwYXJ0aWFsOiBvcmlnaW5hbFJlcXVlc3QsXG4gICAgICAgICAgcG90ZW50aWFsczogY29tcGlsZXJPcHRpb25zLnBhdGhzW3BhdHRlcm5dLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhckluZGV4ID09PSBwYXR0ZXJuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaWYgKG9yaWdpbmFsUmVxdWVzdC5zdGFydHNXaXRoKHBhdHRlcm4uc2xpY2UoMCwgLTEpKSkge1xuICAgICAgICAgIHBhdGhNYXBPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgcGFydGlhbDogb3JpZ2luYWxSZXF1ZXN0LnNsaWNlKHBhdHRlcm4ubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBwb3RlbnRpYWxzOiBjb21waWxlck9wdGlvbnMucGF0aHNbcGF0dGVybl0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IFtwcmVmaXgsIHN1ZmZpeF0gPSBwYXR0ZXJuLnNwbGl0KCcqJyk7XG4gICAgICAgIGlmIChvcmlnaW5hbFJlcXVlc3Quc3RhcnRzV2l0aChwcmVmaXgpICYmIG9yaWdpbmFsUmVxdWVzdC5lbmRzV2l0aChzdWZmaXgpKSB7XG4gICAgICAgICAgcGF0aE1hcE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBwYXJ0aWFsOiBvcmlnaW5hbFJlcXVlc3Quc2xpY2UocHJlZml4Lmxlbmd0aCkuc2xpY2UoMCwgLXN1ZmZpeC5sZW5ndGgpLFxuICAgICAgICAgICAgcG90ZW50aWFsczogY29tcGlsZXJPcHRpb25zLnBhdGhzW3BhdHRlcm5dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICBpZiAocGF0aE1hcE9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgcmVxdWVzdCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocGF0aE1hcE9wdGlvbnMubGVuZ3RoID09PSAxICYmIHBhdGhNYXBPcHRpb25zWzBdLnBvdGVudGlhbHMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3Qgb25seVBvdGVudGlhbCA9IHBhdGhNYXBPcHRpb25zWzBdLnBvdGVudGlhbHNbMF07XG4gICAgbGV0IHJlcGxhY2VtZW50O1xuICAgIGNvbnN0IHN0YXJJbmRleCA9IG9ubHlQb3RlbnRpYWwuaW5kZXhPZignKicpO1xuICAgIGlmIChzdGFySW5kZXggPT09IC0xKSB7XG4gICAgICByZXBsYWNlbWVudCA9IG9ubHlQb3RlbnRpYWw7XG4gICAgfSBlbHNlIGlmIChzdGFySW5kZXggPT09IG9ubHlQb3RlbnRpYWwubGVuZ3RoIC0gMSkge1xuICAgICAgcmVwbGFjZW1lbnQgPSBvbmx5UG90ZW50aWFsLnNsaWNlKDAsIC0xKSArIHBhdGhNYXBPcHRpb25zWzBdLnBhcnRpYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtwcmVmaXgsIHN1ZmZpeF0gPSBvbmx5UG90ZW50aWFsLnNwbGl0KCcqJyk7XG4gICAgICByZXBsYWNlbWVudCA9IHByZWZpeCArIHBhdGhNYXBPcHRpb25zWzBdLnBhcnRpYWwgKyBzdWZmaXg7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5yZXF1ZXN0ID0gcGF0aC5yZXNvbHZlKGNvbXBpbGVyT3B0aW9ucy5iYXNlVXJsIHx8ICcnLCByZXBsYWNlbWVudCk7XG4gICAgY2FsbGJhY2sobnVsbCwgcmVxdWVzdCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtb2R1bGVSZXNvbHZlciA9IHRzLnJlc29sdmVNb2R1bGVOYW1lKFxuICAgIG9yaWdpbmFsUmVxdWVzdCxcbiAgICByZXF1ZXN0LmNvbnRleHRJbmZvLmlzc3VlcixcbiAgICBjb21waWxlck9wdGlvbnMsXG4gICAgaG9zdCxcbiAgICBjYWNoZSxcbiAgKTtcblxuICBjb25zdCBtb2R1bGVGaWxlUGF0aCA9IG1vZHVsZVJlc29sdmVyLnJlc29sdmVkTW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgJiYgbW9kdWxlUmVzb2x2ZXIucmVzb2x2ZWRNb2R1bGUucmVzb2x2ZWRGaWxlTmFtZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyByZXN1bHQsIGxldCB3ZWJwYWNrIHRyeSB0byByZXNvbHZlXG4gIGlmICghbW9kdWxlRmlsZVBhdGgpIHtcbiAgICBjYWxsYmFjayhudWxsLCByZXF1ZXN0KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIElmIFR5cGVTY3JpcHQgZ2l2ZXMgdXMgYSBgLmQudHNgLCBpdCBpcyBwcm9iYWJseSBhIG5vZGUgbW9kdWxlXG4gIGlmIChtb2R1bGVGaWxlUGF0aC5lbmRzV2l0aCgnLmQudHMnKSkge1xuICAgIC8vIElmIGluIGEgcGFja2FnZSwgbGV0IHdlYnBhY2sgcmVzb2x2ZSB0aGUgcGFja2FnZVxuICAgIGNvbnN0IHBhY2thZ2VSb290UGF0aCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUobW9kdWxlRmlsZVBhdGgpLCAncGFja2FnZS5qc29uJyk7XG4gICAgaWYgKCFob3N0LmZpbGVFeGlzdHMocGFja2FnZVJvb3RQYXRoKSkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGVyZSBpcyBhIGZpbGUgd2l0aCBhIC5qcyBleHRlbnNpb24gdXNlIHRoYXRcbiAgICAgIGNvbnN0IGpzRmlsZVBhdGggPSBtb2R1bGVGaWxlUGF0aC5zbGljZSgwLCAtNSkgKyAnLmpzJztcbiAgICAgIGlmIChob3N0LmZpbGVFeGlzdHMoanNGaWxlUGF0aCkpIHtcbiAgICAgICAgcmVxdWVzdC5yZXF1ZXN0ID0ganNGaWxlUGF0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxsYmFjayhudWxsLCByZXF1ZXN0KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlcXVlc3QucmVxdWVzdCA9IG1vZHVsZUZpbGVQYXRoO1xuICBjYWxsYmFjayhudWxsLCByZXF1ZXN0KTtcbn1cbiJdfQ==