import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private evalDialogVisible = new BehaviorSubject<boolean>(false);
    evalDialogVisible$ = this.evalDialogVisible.asObservable();

    openEvaluationDialog() {
        this.evalDialogVisible.next(true);
    }

    closeEvaluationDialog() {
        this.evalDialogVisible.next(false);
    }
}
