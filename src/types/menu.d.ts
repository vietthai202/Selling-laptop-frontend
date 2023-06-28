export interface IMenu {
  id: number;
  name: string;
  url: string;
  sortOrder: number;
  icon: string;
  enable: boolean;
  parent_id: number;
  uiSubmenus: ISubMenu[];
}

export interface ISubMenu {
  id: number;
  name: string;
  url: string;
  sortOrder: number;
  icon: string;
  enable: boolean;
  menu_id: number;
}
