import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Popover,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import moment from 'moment';

const DayEventsPopover = ({ 
  open, 
  anchorEl, 
  anchorOrigin,
  transformOrigin,
  events, 
  onClose, 
  onEventClick,
  date
}) => {
  
  
  const sortedEvents = events?.length ? [...events].sort((a, b) => 
    new Date(a.start) - new Date(b.start)
  ) : [];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Paper sx={{ p: 2, maxWidth: 350, maxHeight: 400, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {date && moment(date).format('DD MMMM, YYYY')}
        </Typography>
        
        <List dense disablePadding>
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <ListItem 
                key={event.id}
                onClick={() => onEventClick(event)}
                sx={{ 
                  mb: 1, 
                  border: '1px solid #eee',
                  borderLeft: `4px solid ${event.backgroundColor || '#000'}`,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      <Chip 
                        label={event.desc} 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${event.backgroundColor || '#000'}20`,
                          color: event.backgroundColor || '#000',
                          fontWeight: 'medium',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có sự kiện nào trong ngày này
            </Typography>
          )}
        </List>
      </Paper>
    </Popover>
  );
};

export default DayEventsPopover;