import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Silk Screen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          (serigraphy) is created by one of the few printmaking processes in which pulling the 
          print does not result in a reversed image. It is a stencil technique in which the 
          stencil is adhered, or exposed to a screen of mesh fabric stretched tightly over a frame. 
          Silk was originally used but polyester and nylons are generally used today. Ink is forced 
          through the mesh with a flexible squeegee (rubber blade). the first color is applied to 
          the entire edition quantity and then the second color thereafter and so forth for each 
          additional color.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Etching / Intaglio</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          a technique in which a print is taken from a sheet of metal, usually copper, zinc or steel, 
          into which the drawing has been bitten with acid. It involves coating a metal plate with a 
          thin acid resistant layer or ground, usually a wax based resin. Using a sharp tool, a drawing 
          is scratched into this layer leaving the metal exposed. The plate is then immersed in a bath 
          of acid which ‘bites’ or etches away the metal in the areas exposed by the drawing. Once the 
          lines have been etched to a sufficient depth the ground is cleaned off. Ink is rubbed into the 
          lines of the design and the surface is wiped clean. A sheet of dampened paper is placed over 
          the plate and it is then fed through a printing press under great pressure. This causes the ink 
          to be pulled out of the incised lines onto the paper and creates the plate mark. Engraving and
           drypoint techniques can also be used in combination with this method of etching to achieve 
           results.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Lithograph</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          literally means ‘stone drawing’. When lithography was invented in Germany in the late 18th century, 
          the print was created by drawing on a special type of smooth limestone, although a metal/plastic 
          surfaces are sometimes used today. It is a planographic or surface process which is based on the fact 
          that grease and water repel each other. Using a greasy medium (a crayon) a drawing is made on the 
          surface of the stone which is dampened with water. Greasy printing ink is then rolled over the surface. 
          The ink adheres to the drawing but is repelled by the damp paper. Any medium, so long as it is oil based, 
          can be used to draw the image and this explains why lithographs can have so many different appearances 
          and are sometimes mistaken for original drawings.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>Relief Printing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          a process in which the image to be printed is created in relief. Unwanted areas are cut away and the image 
          area is left in relief so that when the ink charged roller is passed over the block only the areas in relief 
          receive ink. Woodcut, wood engraving and linocut are examples of relief printing.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography>Monotypes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          unique in that no two prints are alike; although images can be similar, editioning is not possible. 
          The appeal of the monotype lies in the unique translucency that creates a quality of light very different 
          from a painting on paper or a print, and the beauty of this media is also in its spontaneity and its 
          combination of printmaking, painting and drawing mediums. The artist applies ink onto a clean plate 
          or screen and literally paints onto it, once the image is complete it is run through the rest of the 
          printing process.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
          <Typography>Collographs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          takes its name from the French colle, meaning glue, and the Greek graphos, meaning drawing. Essentially, 
          it is a print from a collage. The plate is built up using a collage process which combines materials as 
          diverse as cardboard, fabric, gesso, glue and found objects. Collographs do not necessarily have to be 
          in color. They can be printed blind, where an un-inked plate is put through the printing press to produce 
          an embossed effect on the sheet.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
