"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
const benchmark_1 = require("./benchmark");
class CancellationToken {
    constructor() {
        this._isCancelled = false;
    }
    requestCancellation() {
        this._isCancelled = true;
    }
    isCancellationRequested() {
        return this._isCancelled;
    }
    throwIfCancellationRequested() {
        if (this.isCancellationRequested()) {
            throw new ts.OperationCanceledException();
        }
    }
}
exports.CancellationToken = CancellationToken;
function hasErrors(diags) {
    return diags.some(d => d.category === ts.DiagnosticCategory.Error);
}
exports.hasErrors = hasErrors;
function gatherDiagnostics(program, jitMode, benchmarkLabel, cancellationToken) {
    const allDiagnostics = [];
    let checkOtherDiagnostics = true;
    function checkDiagnostics(fn) {
        if (checkOtherDiagnostics) {
            const diags = fn(undefined, cancellationToken);
            if (diags) {
                allDiagnostics.push(...diags);
                checkOtherDiagnostics = !hasErrors(diags);
            }
        }
    }
    if (jitMode) {
        const tsProgram = program;
        // Check syntactic diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ts.getSyntacticDiagnostics`);
        checkDiagnostics(tsProgram.getSyntacticDiagnostics.bind(tsProgram));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ts.getSyntacticDiagnostics`);
        // Check semantic diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ts.getSemanticDiagnostics`);
        checkDiagnostics(tsProgram.getSemanticDiagnostics.bind(tsProgram));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ts.getSemanticDiagnostics`);
    }
    else {
        const angularProgram = program;
        // Check TypeScript syntactic diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSyntacticDiagnostics`);
        checkDiagnostics(angularProgram.getTsSyntacticDiagnostics.bind(angularProgram));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSyntacticDiagnostics`);
        // Check TypeScript semantic and Angular structure diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSemanticDiagnostics`);
        checkDiagnostics(angularProgram.getTsSemanticDiagnostics.bind(angularProgram));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSemanticDiagnostics`);
        // Check Angular semantic diagnostics
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ng.getNgSemanticDiagnostics`);
        checkDiagnostics(angularProgram.getNgSemanticDiagnostics.bind(angularProgram));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ng.getNgSemanticDiagnostics`);
    }
    return allDiagnostics;
}
exports.gatherDiagnostics = gatherDiagnostics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F0aGVyX2RpYWdub3N0aWNzLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9uZ3Rvb2xzL3dlYnBhY2svc3JjL2dhdGhlcl9kaWFnbm9zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQywyQ0FBNEM7QUFJNUM7SUFBQTtRQUNVLGlCQUFZLEdBQUcsS0FBSyxDQUFDO0lBZS9CLENBQUM7SUFiQyxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQsNEJBQTRCO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7Q0FDRjtBQWhCRCw4Q0FnQkM7QUFFRCxtQkFBMEIsS0FBa0I7SUFDMUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRkQsOEJBRUM7QUFFRCwyQkFDRSxPQUE2QixFQUM3QixPQUFnQixFQUNoQixjQUFzQixFQUN0QixpQkFBcUM7SUFFckMsTUFBTSxjQUFjLEdBQXNDLEVBQUUsQ0FBQztJQUM3RCxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQztJQUVqQywwQkFBOEMsRUFBSztRQUNqRCxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUU5QixxQkFBcUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ1osTUFBTSxTQUFTLEdBQUcsT0FBcUIsQ0FBQztRQUN4QywrQkFBK0I7UUFDL0IsZ0JBQUksQ0FBQyxHQUFHLGNBQWMsK0NBQStDLENBQUMsQ0FBQztRQUN2RSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsbUJBQU8sQ0FBQyxHQUFHLGNBQWMsK0NBQStDLENBQUMsQ0FBQztRQUUxRSw4QkFBOEI7UUFDOUIsZ0JBQUksQ0FBQyxHQUFHLGNBQWMsOENBQThDLENBQUMsQ0FBQztRQUN0RSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbkUsbUJBQU8sQ0FBQyxHQUFHLGNBQWMsOENBQThDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLGNBQWMsR0FBRyxPQUFrQixDQUFDO1FBRTFDLDBDQUEwQztRQUMxQyxnQkFBSSxDQUFDLEdBQUcsY0FBYyxpREFBaUQsQ0FBQyxDQUFDO1FBQ3pFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNoRixtQkFBTyxDQUFDLEdBQUcsY0FBYyxpREFBaUQsQ0FBQyxDQUFDO1FBRTVFLCtEQUErRDtRQUMvRCxnQkFBSSxDQUFDLEdBQUcsY0FBYyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3hFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRSxtQkFBTyxDQUFDLEdBQUcsY0FBYyxnREFBZ0QsQ0FBQyxDQUFDO1FBRTNFLHFDQUFxQztRQUNyQyxnQkFBSSxDQUFDLEdBQUcsY0FBYyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3hFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRSxtQkFBTyxDQUFDLEdBQUcsY0FBYyxnREFBZ0QsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUFuREQsOENBbURDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyB0aW1lLCB0aW1lRW5kIH0gZnJvbSAnLi9iZW5jaG1hcmsnO1xuaW1wb3J0IHsgRGlhZ25vc3RpYywgRGlhZ25vc3RpY3MsIFByb2dyYW0gfSBmcm9tICcuL25ndG9vbHNfYXBpJztcblxuXG5leHBvcnQgY2xhc3MgQ2FuY2VsbGF0aW9uVG9rZW4gaW1wbGVtZW50cyB0cy5DYW5jZWxsYXRpb25Ub2tlbiB7XG4gIHByaXZhdGUgX2lzQ2FuY2VsbGVkID0gZmFsc2U7XG5cbiAgcmVxdWVzdENhbmNlbGxhdGlvbigpIHtcbiAgICB0aGlzLl9pc0NhbmNlbGxlZCA9IHRydWU7XG4gIH1cblxuICBpc0NhbmNlbGxhdGlvblJlcXVlc3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNDYW5jZWxsZWQ7XG4gIH1cblxuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKCkge1xuICAgIGlmICh0aGlzLmlzQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyB0cy5PcGVyYXRpb25DYW5jZWxlZEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzRXJyb3JzKGRpYWdzOiBEaWFnbm9zdGljcykge1xuICByZXR1cm4gZGlhZ3Muc29tZShkID0+IGQuY2F0ZWdvcnkgPT09IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnYXRoZXJEaWFnbm9zdGljcyhcbiAgcHJvZ3JhbTogdHMuUHJvZ3JhbSB8IFByb2dyYW0sXG4gIGppdE1vZGU6IGJvb2xlYW4sXG4gIGJlbmNobWFya0xhYmVsOiBzdHJpbmcsXG4gIGNhbmNlbGxhdGlvblRva2VuPzogQ2FuY2VsbGF0aW9uVG9rZW4sXG4pOiBEaWFnbm9zdGljcyB7XG4gIGNvbnN0IGFsbERpYWdub3N0aWNzOiBBcnJheTx0cy5EaWFnbm9zdGljIHwgRGlhZ25vc3RpYz4gPSBbXTtcbiAgbGV0IGNoZWNrT3RoZXJEaWFnbm9zdGljcyA9IHRydWU7XG5cbiAgZnVuY3Rpb24gY2hlY2tEaWFnbm9zdGljczxUIGV4dGVuZHMgRnVuY3Rpb24+KGZuOiBUKSB7XG4gICAgaWYgKGNoZWNrT3RoZXJEaWFnbm9zdGljcykge1xuICAgICAgY29uc3QgZGlhZ3MgPSBmbih1bmRlZmluZWQsIGNhbmNlbGxhdGlvblRva2VuKTtcbiAgICAgIGlmIChkaWFncykge1xuICAgICAgICBhbGxEaWFnbm9zdGljcy5wdXNoKC4uLmRpYWdzKTtcblxuICAgICAgICBjaGVja090aGVyRGlhZ25vc3RpY3MgPSAhaGFzRXJyb3JzKGRpYWdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaml0TW9kZSkge1xuICAgIGNvbnN0IHRzUHJvZ3JhbSA9IHByb2dyYW0gYXMgdHMuUHJvZ3JhbTtcbiAgICAvLyBDaGVjayBzeW50YWN0aWMgZGlhZ25vc3RpY3MuXG4gICAgdGltZShgJHtiZW5jaG1hcmtMYWJlbH0uZ2F0aGVyRGlhZ25vc3RpY3MudHMuZ2V0U3ludGFjdGljRGlhZ25vc3RpY3NgKTtcbiAgICBjaGVja0RpYWdub3N0aWNzKHRzUHJvZ3JhbS5nZXRTeW50YWN0aWNEaWFnbm9zdGljcy5iaW5kKHRzUHJvZ3JhbSkpO1xuICAgIHRpbWVFbmQoYCR7YmVuY2htYXJrTGFiZWx9LmdhdGhlckRpYWdub3N0aWNzLnRzLmdldFN5bnRhY3RpY0RpYWdub3N0aWNzYCk7XG5cbiAgICAvLyBDaGVjayBzZW1hbnRpYyBkaWFnbm9zdGljcy5cbiAgICB0aW1lKGAke2JlbmNobWFya0xhYmVsfS5nYXRoZXJEaWFnbm9zdGljcy50cy5nZXRTZW1hbnRpY0RpYWdub3N0aWNzYCk7XG4gICAgY2hlY2tEaWFnbm9zdGljcyh0c1Byb2dyYW0uZ2V0U2VtYW50aWNEaWFnbm9zdGljcy5iaW5kKHRzUHJvZ3JhbSkpO1xuICAgIHRpbWVFbmQoYCR7YmVuY2htYXJrTGFiZWx9LmdhdGhlckRpYWdub3N0aWNzLnRzLmdldFNlbWFudGljRGlhZ25vc3RpY3NgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhbmd1bGFyUHJvZ3JhbSA9IHByb2dyYW0gYXMgUHJvZ3JhbTtcblxuICAgIC8vIENoZWNrIFR5cGVTY3JpcHQgc3ludGFjdGljIGRpYWdub3N0aWNzLlxuICAgIHRpbWUoYCR7YmVuY2htYXJrTGFiZWx9LmdhdGhlckRpYWdub3N0aWNzLm5nLmdldFRzU3ludGFjdGljRGlhZ25vc3RpY3NgKTtcbiAgICBjaGVja0RpYWdub3N0aWNzKGFuZ3VsYXJQcm9ncmFtLmdldFRzU3ludGFjdGljRGlhZ25vc3RpY3MuYmluZChhbmd1bGFyUHJvZ3JhbSkpO1xuICAgIHRpbWVFbmQoYCR7YmVuY2htYXJrTGFiZWx9LmdhdGhlckRpYWdub3N0aWNzLm5nLmdldFRzU3ludGFjdGljRGlhZ25vc3RpY3NgKTtcblxuICAgIC8vIENoZWNrIFR5cGVTY3JpcHQgc2VtYW50aWMgYW5kIEFuZ3VsYXIgc3RydWN0dXJlIGRpYWdub3N0aWNzLlxuICAgIHRpbWUoYCR7YmVuY2htYXJrTGFiZWx9LmdhdGhlckRpYWdub3N0aWNzLm5nLmdldFRzU2VtYW50aWNEaWFnbm9zdGljc2ApO1xuICAgIGNoZWNrRGlhZ25vc3RpY3MoYW5ndWxhclByb2dyYW0uZ2V0VHNTZW1hbnRpY0RpYWdub3N0aWNzLmJpbmQoYW5ndWxhclByb2dyYW0pKTtcbiAgICB0aW1lRW5kKGAke2JlbmNobWFya0xhYmVsfS5nYXRoZXJEaWFnbm9zdGljcy5uZy5nZXRUc1NlbWFudGljRGlhZ25vc3RpY3NgKTtcblxuICAgIC8vIENoZWNrIEFuZ3VsYXIgc2VtYW50aWMgZGlhZ25vc3RpY3NcbiAgICB0aW1lKGAke2JlbmNobWFya0xhYmVsfS5nYXRoZXJEaWFnbm9zdGljcy5uZy5nZXROZ1NlbWFudGljRGlhZ25vc3RpY3NgKTtcbiAgICBjaGVja0RpYWdub3N0aWNzKGFuZ3VsYXJQcm9ncmFtLmdldE5nU2VtYW50aWNEaWFnbm9zdGljcy5iaW5kKGFuZ3VsYXJQcm9ncmFtKSk7XG4gICAgdGltZUVuZChgJHtiZW5jaG1hcmtMYWJlbH0uZ2F0aGVyRGlhZ25vc3RpY3MubmcuZ2V0TmdTZW1hbnRpY0RpYWdub3N0aWNzYCk7XG4gIH1cblxuICByZXR1cm4gYWxsRGlhZ25vc3RpY3M7XG59XG4iXX0=