import { Component,ElementRef, ViewChild , OnInit,Injectable, Inject, PLATFORM_ID} from '@angular/core';

import { data } from '../data/recipe';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser,isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

@Injectable()
export class HomeComponent implements OnInit {

  @ViewChild('myModal') model: ElementRef | undefined;
  @ViewChild('overlay') overlay: ElementRef | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: any){
    this.filteredRecipeTitleList = this.recipeList
  }

  recipeObj: Recipe = new Recipe();
  recipeList: Recipe[] = [];

  // 
  filteredRecipeTitleList: Recipe[] = [];

  filterResults(text: string) {
    if (!text) {
      this.filteredRecipeTitleList = this.recipeList;
      return;
    }
  
    this.filteredRecipeTitleList = this.recipeList.filter(
      recipe => recipe?.title.toLowerCase().includes(text.toLowerCase())
    );

  }

  loadData(){
    localStorage.setItem("recipe-data",JSON.stringify(data));
  }


  ngOnInit(): void {
    this.loadData()
    const localData = localStorage.getItem("recipe-data");
    if(localData != null) {
      this.recipeList = JSON.parse(localData)
      // this.recipeTitleList = JSON.parse(localData)
    }
    this.filterResults("")
  }

  openModel() {
    
    const model = document.getElementById("myModal");
    const overlay = document.getElementById("overlay")
    if (model != null) {
      model.style.display = 'block'
    }
    if (overlay != null) {
      overlay.classList.remove("hide");
    }
    window.scrollTo(0, 0);
  }

  openDetailView(){
    const detailView = document.getElementById("detailView")
    const overlay = document.getElementById("overlay")
    if (detailView != null) {
      detailView.classList.remove("hide");
    }
    if (overlay != null) {
      overlay.classList.remove("hide");
    }
    window.scrollTo(0, 0);
  }

  closeModel() {
    this.recipeObj = new Recipe();
    const overlay = document.getElementById("overlay")
    const detailView = document.getElementById("detailView")
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
    if (overlay != null) {
      overlay.classList.add("hide")
    }
    if (detailView != null) {
      detailView.classList.add("hide")
    }
  }

  onDelete(item: Recipe) {
    const isDelet = confirm("Are you sure want to Delete");
    if(isDelet) {
      const currentRecord =  this.recipeList.findIndex(m=> m.id === item.id);
      // const currentRecord =  this.recipeTitleList.findIndex(m=> m.id === item.id);
      this.recipeList.splice(currentRecord,1);
      // this.recipeTitleList.splice(currentRecord,1);
      localStorage.setItem('recipe-data', JSON.stringify(this.recipeList));
      // localStorage.setItem('recipe-data', JSON.stringify(this.recipeTitleList));
    }
  }
  onEdit(item: Recipe) {
    this.recipeObj =  item;
    this.openModel();
  }

  onDetailView(item: Recipe) {
    this.recipeObj =  item;
    this.openDetailView();
  }

  updateRecipe() {
      const currentRecord =  this.recipeList.find(m=> m.id === this.recipeObj.id);
      // const currentRecord =  this.recipeTitleList.find(m=> m.id === this.recipeObj.id);
      if(currentRecord != undefined) {
        currentRecord.title = this.recipeObj.title;
        currentRecord.description =  this.recipeObj.description;
        currentRecord.instructions =  this.recipeObj.instructions;
      };
      localStorage.setItem('recipe-data', JSON.stringify(this.recipeList));
      // localStorage.setItem('recipe-data', JSON.stringify(this.recipeTitleList));
      this.closeModel()
  }
  saveRecipe() {
    debugger;
    const isLocalPresent = localStorage.getItem("recipe-data");
    if (isLocalPresent != null) {
      
      const oldArray = JSON.parse(isLocalPresent);
      this.recipeObj.id = oldArray.length + 1;
      oldArray.push(this.recipeObj);
      this.recipeList = oldArray;
      // this.recipeTitleList = oldArray;
      localStorage.setItem('recipe-data', JSON.stringify(oldArray));
    } else {
      const newArr = [];
      newArr.push(this.recipeObj);
      this.recipeObj.id = 1;
      this.recipeList = newArr;
      localStorage.setItem('recipe-data', JSON.stringify(newArr));
    }
    this.closeModel()
    this.filterResults("")
  }
}

export class Recipe {
  id: number;
  title: string;
  description: string;
  instructions: string;
  ingredients: string;
  cookingTime: string;
  calorieCount: string;
  constructor() {
    this.id = 0;
    this.title = '';
    this.description = '';
    this.instructions = '';
    this.ingredients = '';
    this.cookingTime = '';
    this.calorieCount = ''
  }

}
