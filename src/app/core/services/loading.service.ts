import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { LoadingComponent } from '@shared/components/loading/loading.component';

export class LoadingOverlayRef {
  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private injector: Injector, private overlay: Overlay) {
  }

  open(): LoadingOverlayRef {
    const overlayRef = this.createOverlay();
    const dialogRef = new LoadingOverlayRef(overlayRef);
    const overlayComponent = this.attachDialogContainer(overlayRef, dialogRef);

    return dialogRef;
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, dialogRef: LoadingOverlayRef): LoadingComponent {
    const injector = this.createInjector(dialogRef);
    const containerPortal = new ComponentPortal(LoadingComponent, null, injector);
    const containerRef: ComponentRef<LoadingComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(dialogRef: LoadingOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(LoadingOverlayRef, dialogRef);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
