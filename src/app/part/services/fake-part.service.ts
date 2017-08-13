import {Part} from '../../model/part';
import {PartService} from './part.service';
import {Injectable} from '@angular/core';

@Injectable()
export class PartServiceFake extends PartService {

  constructor() {
    super();
  }

  public loadParts(): Part[] {
    return [{partType: 'Resistor', name: 'resistance', count: 10},
    {partType: 'Resistor', name: 'resistance', count: 10},
    {partType: 'Resistor', name: 'resistance', count: 10},
    {partType: 'LogicGate', name: 'porte NAND', count: 10}
    ];
  }
}
