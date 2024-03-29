import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// Hotkey
import shortcut from '../../shortcut';
// translation
import tr from './shortcut_contents.tr.json';
import trAppbar from '../../app/appbar.tr.json'
// Type
import { State } from '../../types';
// Redux
import { useSelector } from 'react-redux';

interface Column {
  id: 'explain' | 'hotkey';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const ShortcutContents: React.FC = () => {
  const classes = useStyles();

  // Redux states
  const { language } = useSelector((state: State) => state);
  const ln = language;

  const columns: Column[] = [
    { id: 'explain', label: tr.name[ln], minWidth: 170 },
    { id: 'hotkey', label: trAppbar.shortcut[ln], minWidth: 100 },
  ];


  const rows = [
    { explain: tr.beginSearch[ln] , hotkey: shortcut.CMD_SHIFT_S.mac.userFriendly },
    { explain: tr.addWords[ln] , hotkey: shortcut.CMD_ENTER.mac.userFriendly },
    { explain: tr.openDialog[ln] , hotkey: shortcut.CMD_ENTER.mac.userFriendly },
    { explain: tr.closeDialog[ln] , hotkey: shortcut.ESC.general.userFriendly }
  ];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.explain}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShortcutContents;

