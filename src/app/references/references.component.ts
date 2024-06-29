import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ReferenceLeftComponent } from '../shared/referenceLeft/referenceLeft.component';
import { ReferenceRightComponent } from '../shared/referenceRight/referenceRight.component';
interface Reference {
  name: string;
  skills: string[];
  description: string;
  githubLink: string;
  liveLink: string;
  img: string;
}
@Component({
  selector: 'app-references',
  standalone: true,
  imports: [ReferenceLeftComponent, ReferenceRightComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent {
  references: Reference[] = [
    {
      name: 'Join',
      skills: ['JavaScript', 'HTML', 'CSS', 'Firebase', 'Git'],
      description:
        'Task manger inspired by the kanban System. Create and organize tasks drag and drop functions, assign users and categories.',
      githubLink: 'https://github.com/example/join',
      liveLink: 'https://example.com/join',
      img: './assets/img/references/join.png',
    },
    {
      name: 'Sharkie',
      skills: ['JavaScript', 'HTML', 'CSS', 'Git'],
      description:
        'An underwater adventure game using an object-oriented approach. Guide Sharkie, collect poison, and defeat the giant shark.',
      githubLink: 'https://github.com/example/join',
      liveLink: 'https://example.com/join',
      img: './assets/img/references/sharkie.png',
    },
    {
      name: 'PokéCubes',
      skills: ['JavaScript', 'Rest-Api', 'HTML', 'CSS', 'Git'],
      description:
        'A web app using PokeAPI to display first-gen Pokémon on interactive, rotatable cubes. Click on a Pokémon for more info.',
      githubLink: 'https://github.com/example/join',
      liveLink: 'https://example.com/join',
      img: './assets/img/references/pokecubes.png',
    },
  ];
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onMouseEnter() {
    const toSkillsArrow =
      this.el.nativeElement.querySelector('.to-footer-arrow');
    this.renderer.addClass(toSkillsArrow, 'hovered');
  }
  scrollToFooter() {
    const element = document.getElementById('footer-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
