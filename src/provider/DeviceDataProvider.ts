import * as vscode from 'vscode';
import { LedaDevice } from '../interfaces/LedaDevice';
import { loadLedaDevices } from '../helpers/helpers';

/**
 * Data provider for the device tree view.
 */
export class DeviceDataProvider implements vscode.TreeDataProvider<LedaDeviceTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<LedaDeviceTreeItem | undefined | void> = new vscode.EventEmitter<LedaDeviceTreeItem | undefined | void>();
  /**
   * Event that fires when the tree data changes.
   */
  readonly onDidChangeTreeData: vscode.Event<LedaDeviceTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  /**
   * Trigger an update for the tree view.
   */
  update() {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get the tree item representation for the given element.
   * @param element The tree item element.
   * @returns The tree item or a Thenable that resolves to a tree item.
   */
  getTreeItem(element: LedaDeviceTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  /**
   * Get the child elements of the tree view.
   * @param element The parent element (optional).
   * @returns An array of child tree items or undefined.
   */
  async getChildren(element?: LedaDeviceTreeItem): Promise<LedaDeviceTreeItem[] | undefined> {
    try {
      const devices = await loadLedaDevices();
      if (devices) {
        const deviceProfiles = devices.map((device) => {
          return new LedaDeviceTreeItem(device.name, device);
        });
        return Promise.resolve(deviceProfiles);
      }
    } catch (error) {
      return Promise.reject([]);
    }
  }
}

/**
 * Represents a tree item for a LedaDevice in the device tree view.
 */
export class LedaDeviceTreeItem extends vscode.TreeItem {
  /**
   * Create a new LedaDeviceTreeItem.
   * @param label The label of the tree item.
   * @param ledaDevice The LedaDevice associated with the tree item.
   */
  constructor(
    public readonly label: string,
    public readonly ledaDevice: LedaDevice,
  ) {
    super(label);
  }
}