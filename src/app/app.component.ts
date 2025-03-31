import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LucideAngularModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Desafio Preço Justo';
  isDark = false;
  readonly Sun = Sun;
  readonly Moon = Moon;

  ngOnInit() {
    const isDarkSaved = localStorage.getItem('darkMode') === 'true';
    this.isDark = isDarkSaved;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
  

  toggleDarkMode() {
    this.isDark = !this.isDark;
    const html = document.querySelector('html');
    if (this.isDark) {
      html?.classList.add('dark');
    } else {
      html?.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(this.isDark));
  }
}
